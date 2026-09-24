-- AP Study Hub AI usage controls
-- Safe to run more than once in the Supabase SQL Editor.

create table if not exists public.ai_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default (timezone('utc', now()))::date,
  request_count integer not null default 0 check (request_count between 0 and 5),
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);

alter table public.ai_daily_usage enable row level security;

drop policy if exists ai_daily_usage_read_own on public.ai_daily_usage;
create policy ai_daily_usage_read_own
on public.ai_daily_usage
for select
to authenticated
using (user_id = auth.uid());

-- Direct inserts and updates stay blocked. Signed-in users consume quota only
-- through this atomic function, which always uses auth.uid() and a fixed limit.
create or replace function public.consume_study_ai_request()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  today_utc date := (timezone('utc', now()))::date;
  used_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.ai_daily_usage(user_id, usage_date, request_count, updated_at)
  values (current_user_id, today_utc, 1, now())
  on conflict (user_id, usage_date) do update
    set request_count = public.ai_daily_usage.request_count + 1,
        updated_at = now()
    where public.ai_daily_usage.request_count < 5
  returning request_count into used_count;

  if used_count is null then
    raise exception 'Daily AI limit reached';
  end if;

  return jsonb_build_object(
    'used', used_count,
    'remaining', 5 - used_count,
    'limit', 5,
    'resets_at', (today_utc + 1)::text || 'T00:00:00Z'
  );
end;
$$;

revoke all on table public.ai_daily_usage from anon;
revoke insert, update, delete on table public.ai_daily_usage from authenticated;
grant select on table public.ai_daily_usage to authenticated;

revoke all on function public.consume_study_ai_request() from public;
revoke all on function public.consume_study_ai_request() from anon;
grant execute on function public.consume_study_ai_request() to authenticated;

select 'AP Study Hub AI usage controls installed successfully' as result;

