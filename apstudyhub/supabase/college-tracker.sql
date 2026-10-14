-- Optional private account sync for the college tracker.
-- Run in the EXISTING Supabase project's SQL Editor. Browser-only tracking
-- and exports work before this migration is installed. No service key is used.
begin;
create table if not exists public.college_application_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  constraint college_workspace_shape check (
    jsonb_typeof(payload) = 'object'
    and payload ?& array['version','colleges','tasks','essays']
    and payload->'version' = '1'::jsonb
    and jsonb_typeof(payload->'colleges') = 'array'
    and jsonb_typeof(payload->'tasks') = 'array'
    and jsonb_typeof(payload->'essays') = 'array'
    and octet_length(payload::text) <= 2500000
  )
);
alter table public.college_application_workspaces enable row level security;
revoke all on public.college_application_workspaces from public, anon, authenticated;
grant select, insert, update on public.college_application_workspaces to authenticated;
drop policy if exists college_workspace_owner_select on public.college_application_workspaces;
create policy college_workspace_owner_select on public.college_application_workspaces
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists college_workspace_owner_insert on public.college_application_workspaces;
create policy college_workspace_owner_insert on public.college_application_workspaces
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists college_workspace_owner_update on public.college_application_workspaces;
create policy college_workspace_owner_update on public.college_application_workspaces
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
commit;
