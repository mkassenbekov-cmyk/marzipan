-- MARZIPAN OS — Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/lwkmwjrwysvpmqtcvqcj/sql)

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to text,
  assigned_by text,
  due_date text,
  priority text default 'normal',
  status text default 'open',
  zone text,
  created_at timestamptz default now()
);

-- Complaints
create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  client text not null,
  product text,
  description text,
  severity text default 'medium',
  status text default 'open',
  assigned_to text,
  resolution text,
  created_at timestamptz default now()
);

-- Write-offs
create table if not exists writeoffs (
  id uuid primary key default gen_random_uuid(),
  product text not null,
  quantity numeric,
  unit text,
  reason text,
  zone text,
  responsible text,
  amount numeric,
  created_at timestamptz default now()
);

-- Purchase requests
create table if not exists purchase_requests (
  id uuid primary key default gen_random_uuid(),
  product text not null,
  quantity text,
  unit text,
  urgency text default 'normal',
  zone text,
  requested_by text,
  needed_by text,
  status text default 'new',
  created_at timestamptz default now()
);

-- Shifts
create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  employee text not null,
  role text,
  date text,
  planned_start text,
  actual_start text,
  planned_end text,
  actual_end text,
  late integer,
  note text,
  created_at timestamptz default now()
);

-- Customers
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  type text default 'retail',
  city text,
  contact_person text,
  notes text,
  created_at timestamptz default now()
);

-- Debts
create table if not exists debts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  customer_name text not null,
  amount numeric not null,
  due_date text,
  status text default 'active',
  description text,
  created_at timestamptz default now()
);

-- Invoices
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  supplier text,
  amount numeric,
  date text,
  status text default 'pending',
  items jsonb,
  created_at timestamptz default now()
);

-- Kaspi payments
create table if not exists kaspi_payments (
  id uuid primary key default gen_random_uuid(),
  amount numeric not null,
  date text,
  sender text,
  description text,
  status text default 'unmatched',
  customer_id uuid references customers(id),
  created_at timestamptz default now()
);

-- Receipts (goods received)
create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  supplier text,
  invoice_number text,
  date text,
  status text default 'ok',
  items jsonb,
  created_at timestamptz default now()
);

-- Prices
create table if not exists prices (
  id uuid primary key default gen_random_uuid(),
  product text not null,
  cost numeric,
  price numeric,
  unit text,
  category text,
  created_at timestamptz default now()
);

-- Budget
create table if not exists budget_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  planned numeric,
  actual numeric default 0,
  month text,
  created_at timestamptz default now()
);

-- WhatsApp messages
create table if not exists whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  sender text,
  phone text,
  content text,
  type text default 'other',
  status text default 'new',
  amount numeric,
  created_at timestamptz default now()
);

-- Sales data (iiko import)
create table if not exists sales_data (
  id uuid primary key default gen_random_uuid(),
  date text,
  product text,
  quantity numeric,
  revenue numeric,
  cost numeric,
  source text default 'manual',
  created_at timestamptz default now()
);

-- Photo reports
create table if not exists photo_reports (
  id uuid primary key default gen_random_uuid(),
  type text,
  employee text,
  zone text,
  status text default 'pending',
  note text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (open for now, restrict later)
alter table tasks enable row level security;
alter table complaints enable row level security;
alter table writeoffs enable row level security;
alter table purchase_requests enable row level security;
alter table shifts enable row level security;
alter table customers enable row level security;
alter table debts enable row level security;
alter table invoices enable row level security;
alter table kaspi_payments enable row level security;
alter table receipts enable row level security;
alter table prices enable row level security;
alter table budget_items enable row level security;
alter table whatsapp_messages enable row level security;
alter table sales_data enable row level security;
alter table photo_reports enable row level security;

-- Policies: allow all for authenticated users
create policy "Allow all for authenticated" on tasks for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on complaints for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on writeoffs for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on purchase_requests for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on shifts for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on customers for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on debts for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on invoices for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on kaspi_payments for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on receipts for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on prices for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on budget_items for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on whatsapp_messages for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on sales_data for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on photo_reports for all to authenticated using (true) with check (true);
