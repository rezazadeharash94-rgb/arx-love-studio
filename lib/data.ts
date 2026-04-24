import { supabaseAdmin } from "./supabase";
import type { ChecklistItem, Goal, Media, Month } from "./types";

export async function getData() {
  const supabase = supabaseAdmin();

  const [settingsRes, monthsRes, goalsRes, checklistRes, mediaRes] = await Promise.all([
    supabase.from("settings").select("*"),
    supabase.from("months").select("*").order("sort_order"),
    supabase.from("goals").select("*").order("sort_order"),
    supabase.from("checklist").select("*").order("sort_order"),
    supabase.from("media").select("*").order("sort_order"),
  ]);

  if (settingsRes.error) throw settingsRes.error;
  if (monthsRes.error) throw monthsRes.error;
  if (goalsRes.error) throw goalsRes.error;
  if (checklistRes.error) throw checklistRes.error;
  if (mediaRes.error) throw mediaRes.error;

  const settings: Record<string, string> = {};
  for (const row of settingsRes.data || []) settings[row.key] = row.value;

  return {
    settings,
    months: (monthsRes.data || []) as Month[],
    goals: (goalsRes.data || []) as Goal[],
    checklist: (checklistRes.data || []) as ChecklistItem[],
    media: (mediaRes.data || []) as Media[],
  };
}
