-- MARZIPAN OS — schema fixes (run once in Supabase SQL Editor)
-- Adds columns that the forms collect but were missing in the original schema.

alter table customers   add column if not exists address text;
alter table customers   add column if not exists status  text default 'active';
alter table writeoffs   add column if not exists shift   text;
