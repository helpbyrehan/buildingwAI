-- Run once in your EXISTING Supabase project's SQL Editor before using Study AI.
-- New names avoid replacing existing tables or functions. UTC daily limit: five.
begin;
create table if not exists public.vercel_study_ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  used integer not null default 0 check (used between 0 and 5),
  primary key (user_id, usage_day)
);
create table if not exists public.vercel_study_ai_requests (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  refunded boolean not null default false
);
alter table public.vercel_study_ai_usage enable row level security;
alter table public.vercel_study_ai_requests enable row level security;
revoke all on public.vercel_study_ai_usage, public.vercel_study_ai_requests from anon, authenticated;

create or replace function public.vercel_reserve_study_ai(target_user_id uuid, request_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare day_utc date := (now() at time zone 'UTC')::date; total integer;
begin
  insert into public.vercel_study_ai_usage(user_id,usage_day) values (target_user_id,day_utc)
    on conflict do nothing;
  select used into total from public.vercel_study_ai_usage
    where user_id=target_user_id and usage_day=day_utc for update;
  if total >= 5 then return jsonb_build_object('allowed',false,'remaining',0); end if;
  insert into public.vercel_study_ai_requests(id,user_id,usage_day) values(request_id,target_user_id,day_utc);
  update public.vercel_study_ai_usage set used=used+1 where user_id=target_user_id and usage_day=day_utc;
  return jsonb_build_object('allowed',true,'remaining',4-total);
end $$;

create or replace function public.vercel_refund_study_ai(request_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare reservation public.vercel_study_ai_requests%rowtype;
begin
  update public.vercel_study_ai_requests set refunded=true where id=request_id and refunded=false
    returning * into reservation;
  if found then
    update public.vercel_study_ai_usage set used=greatest(0,used-1)
      where user_id=reservation.user_id and usage_day=reservation.usage_day;
  end if;
  return jsonb_build_object('ok',true);
end $$;
revoke all on function public.vercel_reserve_study_ai(uuid,uuid) from public, anon, authenticated;
revoke all on function public.vercel_refund_study_ai(uuid) from public, anon, authenticated;
grant execute on function public.vercel_reserve_study_ai(uuid,uuid) to service_role;
grant execute on function public.vercel_refund_study_ai(uuid) to service_role;
commit;
