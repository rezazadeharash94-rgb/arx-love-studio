import Image from "next/image";
import { Camera, Car, Check, CheckCircle2, Crown, Heart, Music2, PiggyBank, Plane, Settings, Sparkles, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import type { ChecklistItem, Goal, Media, Month } from "@/lib/types";
import { money, percent } from "@/lib/persian";
import { toggleChecklistAction, toggleGoalAction } from "@/lib/actions";

export function HomeExperience({
  settings,
  months,
  goals,
  checklist,
  media,
  currentMonthKey,
}: {
  settings: Record<string, string>;
  months: Month[];
  goals: Goal[];
  checklist: ChecklistItem[];
  media: Media[];
  currentMonthKey: string;
}) {
  const startCash = Number(settings.starting_cash || 0);
  let totalIncome = 0;
  let totalInvestment = 0;
  let balance = startCash;
  const chart = [{ label: "شروع", value: balance }];

  for (const m of months) {
    totalIncome += Number(m.income || 0);
    totalInvestment += Number(m.investment || 0);
    balance += Number(m.income || 0) - Number(m.expense || 0) - Number(m.investment || 0);
    chart.push({ label: m.month_title, value: balance });
  }

  const couplePhotos = media.filter((m) => m.type === "couple_photo").slice(0, 2);
  const currentMonth = months.find((m) => m.month_key === currentMonthKey) || months[0];

  return (
    <main className="mx-auto grid max-w-[1480px] gap-5 p-4 md:p-7">
      <section className="shell-strong aura relative overflow-hidden p-5 md:p-9">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-champagne/30 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-rose/25 blur-3xl" />
        <div className="relative grid gap-8 xl:grid-cols-[1.05fr_.95fr] xl:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/65 px-4 py-2 text-xs font-black text-stone-600">
              <Crown className="h-4 w-4 text-gold" />
              Luxury Couple Life Studio
            </div>
            <h1 className="gold-text text-5xl font-black leading-tight md:text-7xl">{settings.site_title || "Arash & Roxana"}</h1>
            <p className="mt-4 text-2xl font-black text-stone-700 md:text-3xl">{settings.site_tagline || "Two Souls, One Future"}</p>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-9 text-stone-500">{settings.hero_quote || "هر ماه یک خاطره، هر هدف یک قدم به آینده‌ای که با هم می‌سازیم."}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <MiniStat title="کل ورودی" value={money(totalIncome)} />
              <MiniStat title="سرمایه‌گذاری" value={money(totalInvestment)} />
              <MiniStat title="مانده خالص" value={money(balance)} />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/admin" className="btn-primary inline-flex items-center gap-2">
                <Settings className="h-4 w-4" />
                تنظیمات
              </Link>
              <a href="#timeline" className="btn-soft inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                خاطرات
              </a>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_.74fr] gap-4">
            <HeroImage item={couplePhotos[0]} label="عکس اصلی" tall />
            <div className="grid gap-4">
              <HeroImage item={couplePhotos[1]} label="عکس دوم" />
              <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-white/75 to-rose/20 p-5 shadow-soft">
                <Heart className="mb-3 h-8 w-8 text-rose" />
                <p className="text-sm font-black leading-7 text-stone-700">یک فضای خصوصی برای عشق، پول، خاطره و برنامه زندگی.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Stat icon={TrendingUp} title="مانده فعلی" value={balance} desc="تصویر امروز" />
        <Stat icon={Car} title="هدف خودرو" value={Number(settings.car_goal || 0)} desc="رویای جاده‌ای" />
        <Stat icon={Plane} title="سفر اروپا" value={Number(settings.trip_goal || 0)} desc="خاطره بزرگ" />
        <Stat icon={Wallet} title="خوش‌گذرانی" value={Number(settings.fun_goal || 0)} desc="لذت کنترل‌شده" />
        <Stat icon={PiggyBank} title="سرمایه‌گذاری" value={Number(settings.invest_goal || 0)} desc="آینده مشترک" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <div className="shell p-6">
          <div className="mb-5">
            <div className="inline-flex rounded-full bg-white/65 px-4 py-2 text-xs font-black text-stone-500">Financial Flow</div>
            <h2 className="mt-3 text-2xl font-black">نمودار مسیر مالی</h2>
          </div>
          <LuxuryChart data={chart} />
        </div>

        <div className="grid gap-5">
          <section className="shell p-6">
            <h2 className="mb-5 text-2xl font-black">هدف‌های مشترک</h2>
            <div className="grid gap-4">
              {goals.map((g) => <GoalCard key={g.id} goal={g} />)}
            </div>
          </section>

          <section className="shell p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-rose/15 p-3 text-rose"><Music2 className="h-6 w-6" /></div>
              <div>
                <h2 className="text-xl font-black">موزیک ماه جاری</h2>
                <p className="text-sm font-bold text-stone-500">{currentMonth?.month_title}</p>
              </div>
            </div>
            {currentMonth?.song_url ? <audio controls className="w-full" src={currentMonth.song_url} /> : <Empty text="هنوز آهنگی ثبت نشده." />}
          </section>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <section id="timeline" className="shell p-6">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-xs font-black text-stone-500">
              <Camera className="h-4 w-4 text-gold" />
              Memories Timeline
            </div>
            <h2 className="mt-3 text-2xl font-black">تایم‌لاین خاطرات</h2>
          </div>
          <div className="grid gap-5">
            {months.map((m) => <MonthCard key={m.id} month={m} media={media} active={m.month_key === currentMonthKey} />)}
          </div>
        </section>

        <section className="shell p-6">
          <h2 className="mb-5 text-2xl font-black">چک‌لیست مسیر</h2>
          <div className="grid gap-3">
            {checklist.map((item) => (
              <ChecklistToggle key={item.id} item={item} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return <div className="rounded-[1.5rem] border border-white/70 bg-white/65 p-4"><div className="text-xs font-black text-stone-400">{title}</div><div className="mt-2 text-xl font-black">{value}</div></div>;
}

function HeroImage({ item, label, tall = false }: { item?: Media; label: string; tall?: boolean }) {
  return item ? (
    <figure className={`group relative ${tall ? "h-[390px]" : "h-48"} overflow-hidden rounded-[2.4rem] border border-white/80 shadow-aura`}>
      <Image src={item.url} alt={item.caption || label} fill className="object-cover transition duration-700 group-hover:scale-105" priority={tall} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
    </figure>
  ) : <div className={`flex ${tall ? "h-[390px]" : "h-48"} items-center justify-center rounded-[2rem] border border-dashed border-stone-300 bg-white/45 text-sm font-black text-stone-400`}>{label}</div>;
}

function Stat({ icon: Icon, title, value, desc }: { icon: any; title: string; value: number; desc: string }) {
  return <div className="shell group relative overflow-hidden p-5 transition hover:-translate-y-1"><div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-champagne/30 blur-2xl" /><div className="relative"><div className="mb-4 inline-flex rounded-2xl bg-white/70 p-3 text-gold"><Icon className="h-6 w-6" /></div><div className="text-sm font-black text-stone-500">{title}</div><div className="mt-2 text-2xl font-black">{money(value)}</div><div className="mt-2 text-xs font-bold text-stone-400">{desc}</div></div></div>;
}

function GoalCard({ goal }: { goal: Goal }) {
  const p = goal.target_amount > 0 ? Math.min(100, (goal.current_amount / goal.target_amount) * 100) : 0;
  const nextValue = goal.is_done ? "off" : "on";

  return (
    <form action={toggleGoalAction} className={`relative overflow-hidden rounded-[1.7rem] border p-4 ${goal.is_done ? "border-emerald-200 bg-emerald-50" : "border-white/70 bg-white/65"}`}>
      <input type="hidden" name="id" value={goal.id} />
      <input type="hidden" name="is_done" value={nextValue} />
      <button type="submit" className="flex w-full cursor-pointer items-center gap-3 text-right">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${goal.is_done ? "border-emerald-400 bg-emerald-400 text-white" : "border-[#e8d7c4] bg-white text-transparent"}`}>
          <Check className="h-5 w-5" />
        </span>
        <span className="font-black">{goal.title}</span>
      </button>
      <div className="mt-4 flex items-center justify-between text-sm font-extrabold text-stone-600"><span>{money(goal.current_amount)} / {money(goal.target_amount)}</span><span>{percent(p)}</span></div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-gradient-to-l from-gold to-rose" style={{ width: `${p}%` }} /></div>
    </form>
  );
}

function ChecklistToggle({ item }: { item: ChecklistItem }) {
  const nextValue = item.is_done ? "off" : "on";

  return (
    <form action={toggleChecklistAction}>
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="is_done" value={nextValue} />
      <button type="submit" className={`flex w-full cursor-pointer items-center gap-3 rounded-[1.5rem] border p-4 text-right transition ${item.is_done ? "border-emerald-200 bg-emerald-50/80" : "border-white/70 bg-white/65"}`}>
        <span className={item.is_done ? "text-emerald-500" : "text-stone-300"}><CheckCircle2 className="h-8 w-8" /></span>
        <span className="font-black text-stone-700">{item.title}</span>
      </button>
    </form>
  );
}

function LuxuryChart({ data }: { data: { label: string; value: number }[] }) {
  const w = 900, h = 310, pad = 42;
  const values = data.map(d => d.value);
  const minRaw = Math.min(0, ...values);
  const maxRaw = Math.max(1000, ...values);

  // محور عمودی را ۷۰٪ بالاتر از بیشترین مقدار می‌گیریم تا نمودار نفس داشته باشد و به سقف نچسبد
  const min = minRaw < 0 ? minRaw * 1.15 : 0;
  const max = maxRaw * 1.7;
  const range = max - min || 1;

  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) => h - pad - ((v - min) / range) * (h - pad * 2);
  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area = `${pad},${h-pad} ${points} ${x(data.length-1)},${h-pad}`;
  return <div className="overflow-x-auto rounded-[2rem] border border-white/70 bg-gradient-to-br from-white/90 to-rose/10 p-4">
    <svg viewBox={`0 0 ${w} ${h}`} className="min-w-[760px]">
      <defs><linearGradient id="lc" x1="0" x2="1"><stop offset="0%" stopColor="#c9954e"/><stop offset="100%" stopColor="#d88998"/></linearGradient><linearGradient id="lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c9954e" stopOpacity=".34"/><stop offset="100%" stopColor="#d88998" stopOpacity=".02"/></linearGradient></defs>
      {[0,1,2,3,4].map(i => { const yy = pad + i * ((h-pad*2)/4); return <line key={i} x1={pad} x2={w-pad} y1={yy} y2={yy} stroke="rgba(120,90,60,.14)" strokeDasharray="5 8"/> })}
      <polygon points={area} fill="url(#lf)" />
      <polyline points={points} fill="none" stroke="url(#lc)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => <g key={d.label}><circle cx={x(i)} cy={y(d.value)} r="7" fill="#fff" stroke="#c9954e" strokeWidth="3"/><text x={x(i)} y={h-12} textAnchor="middle" fontSize="13" fontWeight="800" fill="#7b6b5e">{d.label}</text></g>)}
    </svg>
  </div>;
}

function MonthCard({ month, media, active }: { month: Month; media: Media[]; active: boolean }) {
  const photos = media.filter(m => m.type === "month_photo" && m.month_id === month.id).slice(0, 5);
  const song = media.find(m => m.type === "month_song" && m.month_id === month.id);
  return <article className={`relative overflow-hidden rounded-[2rem] border bg-white/65 p-5 shadow-soft ${active ? "border-gold/70 ring-4 ring-gold/15" : "border-white/70"}`}>
    <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full opacity-40 blur-2xl" style={{ background: month.color_from }} />
    <div className="relative">
      <div className="flex flex-wrap justify-between gap-4"><div><h3 className="gold-text text-3xl font-black">{month.month_title}</h3><p className="mt-2 text-sm font-bold text-stone-500">{month.note || "یادداشتی ثبت نشده."}</p></div>{song?.url && <a href={song.url} target="_blank" className="rounded-2xl bg-stone-900 px-4 py-2 text-sm font-bold text-white">آهنگ ماه</a>}</div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-black text-stone-600"><span className="rounded-full bg-white/70 px-3 py-2">درآمد: {money(month.income)}</span><span className="rounded-full bg-white/70 px-3 py-2">خرج: {money(month.expense)}</span><span className="rounded-full bg-white/70 px-3 py-2">سرمایه‌گذاری: {money(month.investment)}</span></div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">{photos.length ? photos.map(p => <figure key={p.id} className="relative h-36 overflow-hidden rounded-[1.5rem] bg-stone-100"><Image src={p.url} alt={p.caption || month.month_title} fill className="object-cover" /></figure>) : <Empty text="هنوز عکسی برای این ماه ثبت نشده." />}</div>
    </div>
  </article>;
}

function Empty({ text }: { text: string }) {
  return <div className="col-span-full rounded-[1.5rem] border border-dashed border-stone-300 bg-white/55 p-8 text-center text-sm font-black text-stone-400">{text}</div>;
}
