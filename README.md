# Arash & Roxana Love Studio

نسخه جدید از صفر با متد پایدارتر:

- Next.js App Router
- Supabase Database + Storage
- Server Actions به‌جای API routeهای زیاد
- Admin PIN برای محافظت از پنل تنظیمات
- طراحی لوکس، روشن، پویا و کاربردی
- مدیریت عکس‌ها و آهنگ‌ها از داخل ادمین
- صفحه اصلی کاملاً نمایشی و زیبا

## نصب

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase

1. در Supabase فایل `supabase/schema.sql` را اجرا کن.
2. یک bucket عمومی با نام `memories` بساز.
3. کلیدهای Supabase را در Vercel Environment Variables وارد کن.
4. این دو مورد جدید را هم در Vercel اضافه کن:

```env
ADMIN_PIN=رمز ورود دلخواه
ADMIN_SECRET=یک متن طولانی تصادفی
```

## صفحات

- `/` صفحه اصلی
- `/admin/login` ورود پنل
- `/admin` پنل مدیریت

## نکته

این نسخه برای جایگزینی نسخه قبلی است؛ بهتر است در GitHub یک Branch یا Repo جدید بسازی.
