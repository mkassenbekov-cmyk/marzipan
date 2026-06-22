-- MARZIPAN OS — Employees & Salary
-- Run in Supabase SQL Editor

-- Employees directory
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text,                       -- должность: заготовщик, пекарь, сборщик, ночной админ...
  shift_type text default 'day',       -- day | night
  shift_rate numeric default 0,        -- ставка за смену
  late_penalty numeric default 0,      -- штраф за опоздание (за случай)
  absence_penalty numeric default 0,   -- штраф за прогул (за случай)
  phone text,
  active boolean default true,
  hired_at text,
  note text,
  created_at timestamptz default now()
);

-- Salary records (one per employee per month)
create table if not exists salary_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  month text not null,                 -- '2026-06'
  shifts_count integer default 0,      -- отработано смен (auto from shifts)
  lates_count integer default 0,       -- опозданий (auto from shifts)
  absences_count integer default 0,    -- прогулов (вручную)
  bonus numeric default 0,             -- премия (вручную)
  gross numeric default 0,             -- смены * ставка
  penalties numeric default 0,         -- штрафы
  net numeric default 0,               -- к выплате
  finalized boolean default false,
  created_at timestamptz default now(),
  unique (employee_id, month)
);

alter table employees enable row level security;
alter table salary_records enable row level security;

create policy "Allow all for authenticated" on employees for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on salary_records for all to authenticated using (true) with check (true);
