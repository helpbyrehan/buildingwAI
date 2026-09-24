-- AP Study Hub: approved-teacher migration
-- Run after full-product-upgrade.sql if the product tables already exist.
-- Safe to run repeatedly.

create table if not exists public.teacher_applications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  statement text not null check (char_length(statement) between 20 and 1200),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);

create index if not exists teacher_applications_status_idx
  on public.teacher_applications(status, submitted_at);

alter table public.teacher_applications enable row level security;

drop policy if exists teacher_applications_read on public.teacher_applications;
create policy teacher_applications_read on public.teacher_applications
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists teacher_applications_apply on public.teacher_applications;
create policy teacher_applications_apply on public.teacher_applications
for insert to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
  and reviewed_at is null
  and reviewed_by is null
);

drop policy if exists teacher_applications_admin_update on public.teacher_applications;
create policy teacher_applications_admin_update on public.teacher_applications
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists teacher_applications_admin_delete on public.teacher_applications;
create policy teacher_applications_admin_delete on public.teacher_applications
for delete to authenticated
using (public.is_admin());

create or replace function public.is_approved_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or exists (
    select 1
    from public.teacher_applications
    where user_id = auth.uid() and status = 'approved'
  );
$$;

create or replace function public.review_teacher_application(applicant uuid, decision text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  if decision not in ('approved','rejected') then
    raise exception 'Decision must be approved or rejected';
  end if;
  update public.teacher_applications
  set status = decision, reviewed_at = now(), reviewed_by = auth.uid()
  where user_id = applicant;
  if not found then raise exception 'Teacher application not found'; end if;
end;
$$;

create or replace function public.protect_classroom_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.owner_id is distinct from old.owner_id and not public.is_admin() then
    raise exception 'Only an admin can transfer classroom ownership';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_classroom_owner_trigger on public.classrooms;
create trigger protect_classroom_owner_trigger
before update of owner_id on public.classrooms
for each row execute function public.protect_classroom_owner();

grant execute on function public.is_approved_teacher() to authenticated;
grant execute on function public.review_teacher_application(uuid,text) to authenticated;

-- Only approved teachers/admins may create a classroom.
drop policy if exists classrooms_create on public.classrooms;
create policy classrooms_create on public.classrooms
for insert to authenticated
with check (owner_id = auth.uid() and public.is_approved_teacher());

-- Keep classroom management with its owner/approved managers; the trigger above
-- separately prevents a non-admin from changing owner_id.
drop policy if exists classrooms_manage on public.classrooms;
create policy classrooms_manage on public.classrooms
for update to authenticated
using (public.can_manage_classroom(id))
with check (public.can_manage_classroom(id));

-- Replace the broad all-operations membership policy. A student may join only
-- as a student. Classroom managers may add/remove members and teacher members.
drop policy if exists members_manage on public.classroom_members;
drop policy if exists members_insert on public.classroom_members;
drop policy if exists members_update on public.classroom_members;
drop policy if exists members_delete on public.classroom_members;

create policy members_insert on public.classroom_members
for insert to authenticated
with check (
  (user_id = auth.uid() and member_role = 'student')
  or public.can_manage_classroom(classroom_id)
);

create policy members_update on public.classroom_members
for update to authenticated
using (public.can_manage_classroom(classroom_id))
with check (public.can_manage_classroom(classroom_id));

create policy members_delete on public.classroom_members
for delete to authenticated
using (user_id = auth.uid() or public.can_manage_classroom(classroom_id));

-- Replies to a private classroom discussion require classroom visibility.
drop policy if exists replies_create on public.post_replies;
create policy replies_create on public.post_replies
for insert to authenticated
with check (
  author_id = auth.uid()
  and exists (
    select 1 from public.discussion_posts p
    where p.id = post_id
      and (p.classroom_id is null or public.can_view_classroom(p.classroom_id))
  )
);

select 'Approved-teacher security migration installed successfully' as result;
