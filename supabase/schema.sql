create extension if not exists "uuid-ossp";

create table if not exists settings (
  key text primary key,
  value text not null default ''
);

create table if not exists months (
  id uuid primary key default uuid_generate_v4(),
  month_key text unique not null,
  month_title text not null,
  sort_order int not null default 0,
  income numeric not null default 0,
  expense numeric not null default 0,
  investment numeric not null default 0,
  note text not null default '',
  song_url text not null default '',
  color_from text not null default '#f7d7b5',
  color_to text not null default '#e9a8b2',
  created_at timestamptz default now()
);

create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  target_amount numeric not null default 0,
  current_amount numeric not null default 0,
  is_done boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists checklist (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  is_done boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists media (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('couple_photo', 'month_photo', 'month_song')),
  month_id uuid references months(id) on delete cascade,
  url text not null,
  storage_path text not null default '',
  caption text not null default '',
  sort_order int not null default 0,
  created_at timestamptz default now()
);

insert into settings(key, value) values
('site_title', 'Arash & Roxana'),
('site_tagline', 'Two Souls, One Future'),
('hero_quote', 'هر ماه یک خاطره، هر هدف یک قدم به آینده‌ای که با هم می‌سازیم.'),
('starting_cash', '15000'),
('car_goal', '40000'),
('trip_goal', '15000'),
('fun_goal', '35000'),
('invest_goal', '180000')
on conflict (key) do nothing;

insert into months(month_key, month_title, sort_order, color_from, color_to) values
('ordibehesht','اردیبهشت',1,'#f8d7b6','#f0a8b1'),
('khordad','خرداد',2,'#d8f3dc','#a7d8b8'),
('tir','تیر',3,'#dbeafe','#93c5fd'),
('mordad','مرداد',4,'#fde68a','#f59e0b'),
('shahrivar','شهریور',5,'#fbcfe8','#f472b6'),
('mehr','مهر',6,'#fed7aa','#fb923c'),
('aban','آبان',7,'#ddd6fe','#a78bfa'),
('azar','آذر',8,'#cffafe','#22d3ee'),
('dey','دی',9,'#e5e7eb','#94a3b8'),
('bahman','بهمن',10,'#fce7f3','#f9a8d4'),
('esfand','اسفند',11,'#dcfce7','#86efac')
on conflict (month_key) do nothing;

insert into goals(title, target_amount, current_amount, sort_order) values
('خرید خودرو', 40000, 0, 1),
('سفر اروپا', 15000, 0, 2),
('سرمایه‌گذاری آخر سال', 180000, 0, 3),
('بودجه خوش‌گذرانی', 35000, 0, 4),
('بافر نقدی امن', 25000, 0, 5)
on conflict do nothing;

insert into checklist(title, sort_order) values
('اولین سرمایه‌گذاری انجام شد', 1),
('برنامه سفر اروپا مشخص شد', 2),
('بودجه خودرو کامل شد', 3),
('عکس‌های خاطره‌انگیز ماهانه اضافه شد', 4),
('هدف اصلی آخر سال زده شد', 5)
on conflict do nothing;
