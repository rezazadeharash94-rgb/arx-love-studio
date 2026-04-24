export function fa(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function money(value: number | string | null | undefined): string {
  const n = Number(value || 0);
  return `${fa(Math.round(n).toLocaleString("en-US"))} $`;
}

export function percent(value: number): string {
  return `${fa(Math.round(value))}٪`;
}

export function currentJalaliMonthName(): string {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "long" }).format(new Date());
}

export function currentDashboardMonthKey(): string {
  const month = currentJalaliMonthName();
  const map: Record<string, string> = {
    اردیبهشت: "ordibehesht",
    خرداد: "khordad",
    تیر: "tir",
    مرداد: "mordad",
    شهریور: "shahrivar",
    مهر: "mehr",
    آبان: "aban",
    آذر: "azar",
    دی: "dey",
    بهمن: "bahman",
    اسفند: "esfand",
  };
  return map[month] || "ordibehesht";
}
