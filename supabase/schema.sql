-- =========================================================================
--  Гибрид Разряд — схема базы данных Supabase
--  Выполните этот файл целиком в SQL Editor вашего проекта Supabase
--  (Project -> SQL Editor -> New query -> вставьте файл -> Run)
-- =========================================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- profiles: публичный профиль пользователя, 1:1 с auth.users
-- -------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Автоматическое создание строки в profiles при регистрации нового пользователя
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------------------------------------------------------
-- cars: автомобили, привязанные к аккаунту пользователя
-- -------------------------------------------------------------------------
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  brand text not null,
  model text not null,
  color text,
  plate_number text,
  battery_percent int not null default 50 check (battery_percent between 0 and 100),
  range_km int not null default 0,
  connector_type text default 'Type 2 (CCS)',
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.cars enable row level security;

drop policy if exists "cars_all_own" on public.cars;
create policy "cars_all_own" on public.cars
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists cars_user_id_idx on public.cars (user_id);

-- -------------------------------------------------------------------------
-- tariffs: публичные тарифные планы (read-only для клиентов)
-- -------------------------------------------------------------------------
create table if not exists public.tariffs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10, 2) not null,
  target_percent int not null default 100,
  is_night boolean not null default false,
  sort_order int not null default 0
);

alter table public.tariffs enable row level security;

drop policy if exists "tariffs_select_all" on public.tariffs;
create policy "tariffs_select_all" on public.tariffs
  for select using (true);

insert into public.tariffs (name, description, price, target_percent, is_night, sort_order)
select * from (
  values
    ('Быстрая зарядка', 'До 80%', 1900.00, 80, false, 1),
    ('Стандартная зарядка', 'До 100%', 2400.00, 100, false, 2),
    ('Ночная зарядка', 'С 00:00 до 06:00', 1600.00, 100, true, 3)
) as seed(name, description, price, target_percent, is_night, sort_order)
where not exists (select 1 from public.tariffs);

-- -------------------------------------------------------------------------
-- orders: заказы мобильной зарядки
-- -------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  car_id uuid references public.cars (id) on delete set null,
  car_brand text not null,
  car_model text not null,
  address text not null,
  latitude double precision,
  longitude double precision,
  order_date text not null,
  order_time text not null,
  tariff_id uuid references public.tariffs (id) on delete set null,
  tariff_name text not null,
  price numeric(10, 2) not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'en_route', 'charging', 'completed', 'cancelled')),
  battery_start int not null default 0,
  battery_end int,
  energy_kwh numeric(6, 2),
  duration_minutes int,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.orders enable row level security;

drop policy if exists "orders_all_own" on public.orders;
create policy "orders_all_own" on public.orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

-- -------------------------------------------------------------------------
-- payment_methods: сохранённые способы оплаты
-- -------------------------------------------------------------------------
create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null check (provider in ('card', 'apple_pay', 'google_pay')),
  brand text,
  last4 text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.payment_methods enable row level security;

drop policy if exists "payment_methods_all_own" on public.payment_methods;
create policy "payment_methods_all_own" on public.payment_methods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists payment_methods_user_id_idx on public.payment_methods (user_id);

-- =========================================================================
-- Готово. Не забудьте:
-- 1) В Authentication -> Providers включить Email (можно отключить
--    подтверждение почты для быстрого тестирования на этапе разработки).
-- 2) Скопировать Project URL и anon public key (Settings -> API) в .env
--    и в eas.json (переменные EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY).
-- =========================================================================
