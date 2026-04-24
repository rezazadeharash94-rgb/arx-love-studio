import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getData } from "@/lib/data";
import { addGoalAction, deleteGoalAction, deleteMediaAction, logoutAction, saveGoalAction, saveMonthAction, saveSettingsAction, uploadMediaAction } from "@/lib/actions";
import { LogOut, Plus, Trash2, UploadCloud } from "lucide-react";
import type { Media } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const isAdmin = cookies().get("arx_admin")?.value === process.env.ADMIN_SECRET;
  if (!isAdmin) redirect("/admin/login");

  const { settings, months, goals, media } = await getData();
  const photos = media.filter(m => m.type === "couple_photo" || m.type === "month_photo");
  const songs = media.filter(m => m.type === "month_song");

  function monthName(id: string | null) {
    if (!id) return "هدر / دونفره";
    return months.find(m => m.id === id)?.month_title || "ماه نامشخص";
  }

  return (
    <main className="mx-auto grid max-w-[1380px] gap-5 p-4 md:p-7">
      <section className="shell-strong p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-gold">Arash & Roxana Studio</p>
            <h1 className="mt-2 text-4xl font-black">تنظیمات کامل سایت</h1>
            <p className="mt-3 text-sm font-bold text-stone-500">مدیریت همه چیز در یک پنل تمیز و کاربردی.</p>
          </div>
          <form action={logoutAction}><button className="btn-soft inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> خروج</button></form>
        </div>
      </section>

      <section className="shell p-6">
        <h2 className="mb-5 text-2xl font-black">تنظیمات کلی</h2>
        <form action={saveSettingsAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field name="site_title" label="عنوان سایت" value={settings.site_title} />
          <Field name="site_tagline" label="زیرعنوان" value={settings.site_tagline} />
          <Field name="hero_quote" label="متن عاشقانه" value={settings.hero_quote} />
          <Field name="starting_cash" label="پول نقد شروع" value={settings.starting_cash} type="number" />
          <Field name="car_goal" label="هدف خودرو" value={settings.car_goal} type="number" />
          <Field name="trip_goal" label="هدف سفر" value={settings.trip_goal} type="number" />
          <Field name="fun_goal" label="هدف خوش‌گذرانی" value={settings.fun_goal} type="number" />
          <Field name="invest_goal" label="هدف سرمایه‌گذاری" value={settings.invest_goal} type="number" />
          <button className="btn-primary md:col-span-2 xl:col-span-4">ذخیره تنظیمات</button>
        </form>
      </section>

      <section className="shell p-6">
        <h2 className="mb-5 text-2xl font-black">مدیریت عکس‌های آپلودشده</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {photos.length ? photos.map(p => <MediaCard key={p.id} item={p} label={monthName(p.month_id)} />) : <Empty text="هنوز عکسی آپلود نشده است." />}
        </div>
      </section>

      <section className="shell p-6">
        <h2 className="mb-5 text-2xl font-black">افزودن عکس دونفره هدر</h2>
        <form action={uploadMediaAction} className="grid gap-4 md:grid-cols-[1fr_1fr_120px_auto]">
          <input type="hidden" name="type" value="couple_photo" />
          <input className="input" type="file" name="file" accept="image/*" required />
          <input className="input" name="caption" placeholder="کپشن" />
          <input className="input" name="sort_order" type="number" defaultValue="0" placeholder="ترتیب" />
          <button className="btn-primary inline-flex items-center justify-center gap-2"><UploadCloud className="h-4 w-4" /> آپلود</button>
        </form>
      </section>

      <section className="shell p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">هدف‌ها</h2>
            <p className="mt-2 text-sm font-bold text-stone-500">هدف جدید اضافه کن، هدف‌های قبلی را ویرایش یا حذف کن.</p>
          </div>
        </div>

        <form action={addGoalAction} className="mb-5 grid gap-4 rounded-[1.7rem] border border-dashed border-gold/50 bg-white/45 p-4 md:grid-cols-4">
          <Field name="title" label="عنوان هدف جدید" value="" />
          <Field name="current_amount" label="مقدار فعلی" value="0" type="number" />
          <Field name="target_amount" label="مقدار هدف" value="0" type="number" />
          <div className="grid items-end">
            <button className="btn-primary inline-flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> افزودن هدف</button>
          </div>
        </form>

        <div className="grid gap-4">
          {goals.map(g => (
            <div key={g.id} className="grid gap-3 rounded-[1.7rem] border border-white/70 bg-white/60 p-4">
              <form action={saveGoalAction} className="grid gap-4 md:grid-cols-4">
                <input type="hidden" name="id" value={g.id} />
                <Field name="title" label="عنوان" value={g.title} />
                <Field name="current_amount" label="مقدار فعلی" value={String(g.current_amount)} type="number" />
                <Field name="target_amount" label="مقدار هدف" value={String(g.target_amount)} type="number" />
                <div className="grid items-end"><button className="btn-primary">ذخیره</button></div>
              </form>

              <form action={deleteGoalAction}>
                <input type="hidden" name="id" value={g.id} />
                <button className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-100">
                  <Trash2 className="ml-1 inline h-4 w-4" />
                  حذف این هدف
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <h2 className="px-2 text-2xl font-black">ماه‌ها، عکس‌ها و آهنگ</h2>
        {months.map(m => {
          const monthPhotos = photos.filter(p => p.month_id === m.id);
          const monthSongs = songs.filter(s => s.month_id === m.id);
          return <div key={m.id} className="shell p-6">
            <h3 className="mb-5 text-2xl font-black gold-text">{m.month_title}</h3>
            <form action={saveMonthAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <input type="hidden" name="id" value={m.id} />
              <Field name="month_title" label="عنوان ماه" value={m.month_title} />
              <Field name="income" label="درآمد" value={String(m.income)} type="number" />
              <Field name="expense" label="خرج" value={String(m.expense)} type="number" />
              <Field name="investment" label="سرمایه‌گذاری" value={String(m.investment)} type="number" />
              <Field name="note" label="یادداشت" value={m.note} />
              <button className="btn-primary xl:col-span-5">ذخیره اطلاعات ماه</button>
            </form>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              <div className="rounded-[1.7rem] border border-white/70 bg-white/55 p-4">
                <h4 className="mb-4 font-black">آپلود عکس ماهانه</h4>
                <form action={uploadMediaAction} className="grid gap-3">
                  <input type="hidden" name="type" value="month_photo" />
                  <input type="hidden" name="month_id" value={m.id} />
                  <input className="input" type="file" name="file" accept="image/*" required />
                  <input className="input" name="caption" placeholder="کپشن عکس" />
                  <input className="input" name="sort_order" type="number" defaultValue="0" />
                  <button className="btn-primary">آپلود عکس</button>
                </form>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {monthPhotos.length ? monthPhotos.map(p => <MediaCard key={p.id} item={p} label={m.month_title} />) : <Empty text="عکسی برای این ماه نیست." />}
                </div>
              </div>

              <div className="rounded-[1.7rem] border border-white/70 bg-white/55 p-4">
                <h4 className="mb-4 font-black">آهنگ ماه</h4>
                <form action={uploadMediaAction} className="grid gap-3">
                  <input type="hidden" name="type" value="month_song" />
                  <input type="hidden" name="month_id" value={m.id} />
                  <input className="input" type="file" name="file" accept="audio/*" required />
                  <input className="input" name="caption" placeholder="نام آهنگ" />
                  <button className="btn-primary">آپلود / تغییر آهنگ</button>
                </form>
                <div className="mt-4 grid gap-3">
                  {monthSongs.length ? monthSongs.map(s => <SongCard key={s.id} item={s} />) : <Empty text="آهنگی برای این ماه نیست." />}
                </div>
              </div>
            </div>
          </div>
        })}
      </section>
    </main>
  );
}

function Field({ name, label, value, type = "text" }: { name: string; label: string; value?: string; type?: string }) {
  return <label className="grid gap-2 text-sm font-black text-stone-600">{label}<input className="input" name={name} type={type} defaultValue={value || ""} /></label>;
}

function MediaCard({ item, label }: { item: Media; label: string }) {
  return <div className="overflow-hidden rounded-[1.4rem] border border-white/70 bg-white shadow-soft">
    <div className="relative aspect-square overflow-hidden bg-stone-100">
      <img src={item.url} alt={item.caption || "media"} className="h-full w-full object-cover" />
    </div>
    <div className="grid gap-2 p-3">
      <div className="rounded-xl bg-stone-100 px-3 py-2 text-xs font-black text-stone-600">{label}</div>
      <div className="truncate text-xs font-bold text-stone-500">{item.caption || "بدون کپشن"}</div>
      <form action={deleteMediaAction}>
        <input type="hidden" name="id" value={item.id} />
        <button className="w-full rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"><Trash2 className="ml-1 inline h-4 w-4" /> حذف</button>
      </form>
    </div>
  </div>
}

function SongCard({ item }: { item: Media }) {
  return <div className="rounded-[1.4rem] border border-white/70 bg-white p-4 shadow-soft">
    <div className="mb-3 text-sm font-black">{item.caption || "آهنگ ماه"}</div>
    <audio controls className="w-full" src={item.url} />
    <form action={deleteMediaAction} className="mt-3">
      <input type="hidden" name="id" value={item.id} />
      <button className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"><Trash2 className="ml-1 inline h-4 w-4" /> حذف آهنگ</button>
    </form>
  </div>
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-[1.4rem] border border-dashed border-stone-300 bg-white/50 p-6 text-center text-sm font-black text-stone-400">{text}</div>;
}
