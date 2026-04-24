"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "./supabase";

function isAdmin() {
  return cookies().get("arx_admin")?.value === process.env.ADMIN_SECRET;
}

function requireAdmin() {
  if (!isAdmin()) redirect("/admin/login");
}

export async function loginAction(formData: FormData) {
  const pin = String(formData.get("pin") || "");
  if (pin !== process.env.ADMIN_PIN) {
    redirect("/admin/login?error=1");
  }
  cookies().set("arx_admin", process.env.ADMIN_SECRET || "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
}

export async function logoutAction() {
  cookies().delete("arx_admin");
  redirect("/admin/login");
}

export async function saveSettingsAction(formData: FormData) {
  requireAdmin();
  const keys = ["site_title", "site_tagline", "hero_quote", "starting_cash", "car_goal", "trip_goal", "fun_goal", "invest_goal"];
  const rows = keys.map((key) => ({ key, value: String(formData.get(key) || "") }));
  const { error } = await supabaseAdmin().from("settings").upsert(rows, { onConflict: "key" });
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveMonthAction(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabaseAdmin()
    .from("months")
    .update({
      month_title: String(formData.get("month_title") || ""),
      income: Number(formData.get("income") || 0),
      expense: Number(formData.get("expense") || 0),
      investment: Number(formData.get("investment") || 0),
      note: String(formData.get("note") || ""),
    })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addGoalAction(formData: FormData) {
  requireAdmin();
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const { data: maxRow } = await supabaseAdmin()
    .from("goals")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSort = Number(maxRow?.sort_order || 0) + 1;

  const { error } = await supabaseAdmin().from("goals").insert({
    title,
    current_amount: Number(formData.get("current_amount") || 0),
    target_amount: Number(formData.get("target_amount") || 0),
    is_done: false,
    sort_order: nextSort,
  });

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveGoalAction(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabaseAdmin()
    .from("goals")
    .update({
      title: String(formData.get("title") || ""),
      current_amount: Number(formData.get("current_amount") || 0),
      target_amount: Number(formData.get("target_amount") || 0),
    })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteGoalAction(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const { error } = await supabaseAdmin().from("goals").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleGoalAction(formData: FormData) {
  const id = String(formData.get("id"));
  const next = String(formData.get("is_done") || "");
  const is_done = next === "on";
  const { error } = await supabaseAdmin().from("goals").update({ is_done }).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleChecklistAction(formData: FormData) {
  const id = String(formData.get("id"));
  const next = String(formData.get("is_done") || "");
  const is_done = next === "on";
  const { error } = await supabaseAdmin().from("checklist").update({ is_done }).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadMediaAction(formData: FormData) {
  requireAdmin();
  const supabase = supabaseAdmin();

  const file = formData.get("file") as File | null;
  const type = String(formData.get("type") || "");
  const month_id = String(formData.get("month_id") || "") || null;
  const caption = String(formData.get("caption") || "");
  const sort_order = Number(formData.get("sort_order") || 0);

  if (!file || file.size === 0) return;

  if (type === "month_photo" && month_id) {
    const { count } = await supabase
      .from("media")
      .select("*", { count: "exact", head: true })
      .eq("type", "month_photo")
      .eq("month_id", month_id);
    if ((count || 0) >= 5) throw new Error("برای هر ماه حداکثر ۵ عکس مجاز است.");
  }

  if (type === "month_song" && month_id) {
    const { data: oldSongs } = await supabase.from("media").select("*").eq("type", "month_song").eq("month_id", month_id);
    for (const old of oldSongs || []) {
      if (old.storage_path) await supabase.storage.from("memories").remove([old.storage_path]);
    }
    await supabase.from("media").delete().eq("type", "month_song").eq("month_id", month_id);
  }

  const ext = file.name.split(".").pop() || "bin";
  const folder = type === "month_song" ? "songs" : "images";
  const path = `${folder}/${type}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("memories").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("memories").getPublicUrl(path);
  const url = data.publicUrl;

  const { error } = await supabase.from("media").insert({ type, month_id, url, storage_path: path, caption, sort_order });
  if (error) throw error;

  if (type === "month_song" && month_id) {
    const { error: mError } = await supabase.from("months").update({ song_url: url }).eq("id", month_id);
    if (mError) throw mError;
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteMediaAction(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id"));
  const supabase = supabaseAdmin();

  const { data: item, error: readError } = await supabase.from("media").select("*").eq("id", id).single();
  if (readError) throw readError;

  if (item.storage_path) {
    await supabase.storage.from("memories").remove([item.storage_path]);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw error;

  if (item.type === "month_song" && item.month_id) {
    await supabase.from("months").update({ song_url: "" }).eq("id", item.month_id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
