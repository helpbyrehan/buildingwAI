-- AP Study Hub: full product upgrade
-- Safe to run more than once in the Supabase SQL editor.
-- Requires the existing public.profiles, public.courses and public.resources tables.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public.user_courses (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id bigint not null references public.courses(id) on delete cascade,
  exam_date date,
  target_score smallint check (target_score between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id bigint not null references public.courses(id) on delete cascade,
  unit_number smallint not null check (unit_number between 1 and 20),
  unit_name text,
  status text not null default 'not_started' check (status in ('not_started','studying','needs_review','confident')),
  confidence smallint not null default 1 check (confidence between 1 and 5),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id, unit_number)
);

create table if not exists public.study_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id bigint references public.courses(id) on delete set null,
  title text not null check (char_length(title) between 2 and 120),
  notes text check (char_length(coalesce(notes,'')) <= 1000),
  due_date date not null,
  minutes integer not null default 30 check (minutes between 5 and 480),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recent_views (
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id bigint not null references public.resources(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

create table if not exists public.resource_feedback (
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id bigint not null references public.resources(id) on delete cascade,
  helpful boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

create table if not exists public.resource_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id bigint not null references public.resources(id) on delete cascade,
  reason text not null check (reason in ('broken','outdated','incorrect','copyright','unsafe','other')),
  details text check (char_length(coalesce(details,'')) <= 1000),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  course_id bigint references public.courses(id) on delete set null,
  title text not null check (char_length(title) between 2 and 80),
  description text check (char_length(coalesce(description,'')) <= 600),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.collections add column if not exists course_id bigint references public.courses(id) on delete set null;

create table if not exists public.collection_items (
  collection_id uuid not null references public.collections(id) on delete cascade,
  resource_id bigint not null references public.resources(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (collection_id, resource_id)
);

create table if not exists public.collection_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, collection_id)
);

create table if not exists public.flashcard_decks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  course_id bigint references public.courses(id) on delete set null,
  title text not null check (char_length(title) between 2 and 100),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.flashcard_decks(id) on delete cascade,
  front text not null check (char_length(front) between 1 and 1000),
  back text not null check (char_length(back) between 1 and 2000),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.flashcard_reviews (
  user_id uuid not null references auth.users(id) on delete cascade,
  flashcard_id uuid not null references public.flashcards(id) on delete cascade,
  ease numeric not null default 2.5 check (ease between 1.3 and 3.5),
  interval_days integer not null default 0 check (interval_days >= 0),
  repetitions integer not null default 0 check (repetitions >= 0),
  due_at timestamptz not null default now(),
  last_rating smallint check (last_rating between 0 and 3),
  updated_at timestamptz not null default now(),
  primary key (user_id, flashcard_id)
);

create table if not exists public.practice_questions (
  id uuid primary key default gen_random_uuid(),
  course_id bigint references public.courses(id) on delete cascade,
  unit_number smallint check (unit_number between 1 and 20),
  prompt text not null,
  choices jsonb not null check (jsonb_typeof(choices) = 'array' and jsonb_array_length(choices) >= 2),
  correct_index smallint not null check (correct_index >= 0),
  explanation text not null,
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  source_label text not null default 'AP Study Hub',
  is_published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.practice_questions(id) on delete cascade,
  selected_index smallint not null check (selected_index >= 0),
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  course_id bigint references public.courses(id) on delete set null,
  name text not null check (char_length(name) between 2 and 80),
  description text check (char_length(coalesce(description,'')) <= 600),
  join_code text not null unique default upper(substr(encode(gen_random_bytes(8),'hex'),1,8)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.classroom_members (
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null default 'student' check (member_role in ('teacher','student')),
  joined_at timestamptz not null default now(),
  primary key (classroom_id, user_id)
);

create table if not exists public.classroom_resources (
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  resource_id bigint not null references public.resources(id) on delete cascade,
  added_by uuid not null references auth.users(id) on delete cascade,
  note text check (char_length(coalesce(note,'')) <= 500),
  due_date date,
  created_at timestamptz not null default now(),
  primary key (classroom_id, resource_id)
);

create table if not exists public.discussion_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  course_id bigint references public.courses(id) on delete set null,
  classroom_id uuid references public.classrooms(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 140),
  body text not null check (char_length(body) between 4 and 4000),
  is_resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.discussion_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 3000),
  is_accepted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_active_date date,
  updated_at timestamptz not null default now()
);

create index if not exists course_progress_user_idx on public.course_progress(user_id, course_id);
create index if not exists study_tasks_due_idx on public.study_tasks(user_id, due_date);
create index if not exists recent_views_user_idx on public.recent_views(user_id, viewed_at desc);
create index if not exists feedback_resource_idx on public.resource_feedback(resource_id);
create index if not exists collections_public_idx on public.collections(is_public, updated_at desc);
create index if not exists practice_course_idx on public.practice_questions(course_id, unit_number);
create index if not exists attempts_user_idx on public.practice_attempts(user_id, created_at desc);
create index if not exists posts_course_idx on public.discussion_posts(course_id, created_at desc);

drop trigger if exists course_progress_updated_at on public.course_progress;
create trigger course_progress_updated_at before update on public.course_progress for each row execute function public.set_updated_at();
drop trigger if exists study_tasks_updated_at on public.study_tasks;
create trigger study_tasks_updated_at before update on public.study_tasks for each row execute function public.set_updated_at();
drop trigger if exists resource_feedback_updated_at on public.resource_feedback;
create trigger resource_feedback_updated_at before update on public.resource_feedback for each row execute function public.set_updated_at();
drop trigger if exists collections_updated_at on public.collections;
create trigger collections_updated_at before update on public.collections for each row execute function public.set_updated_at();
drop trigger if exists flashcard_decks_updated_at on public.flashcard_decks;
create trigger flashcard_decks_updated_at before update on public.flashcard_decks for each row execute function public.set_updated_at();
drop trigger if exists classrooms_updated_at on public.classrooms;
create trigger classrooms_updated_at before update on public.classrooms for each row execute function public.set_updated_at();
drop trigger if exists discussion_posts_updated_at on public.discussion_posts;
create trigger discussion_posts_updated_at before update on public.discussion_posts for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;

create or replace function public.can_view_classroom(cid uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.classrooms c where c.id=cid and c.owner_id=auth.uid())
    or exists(select 1 from public.classroom_members m where m.classroom_id=cid and m.user_id=auth.uid())
    or public.is_admin();
$$;

create or replace function public.can_manage_classroom(cid uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.classrooms c where c.id=cid and c.owner_id=auth.uid())
    or exists(select 1 from public.classroom_members m where m.classroom_id=cid and m.user_id=auth.uid() and m.member_role='teacher')
    or public.is_admin();
$$;

create or replace function public.join_classroom(code text)
returns uuid language plpgsql security definer set search_path=public as $$
declare cid uuid;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select id into cid from public.classrooms where upper(join_code)=upper(trim(code));
  if cid is null then raise exception 'Class code not found'; end if;
  insert into public.classroom_members(classroom_id,user_id,member_role)
  values(cid,auth.uid(),'student') on conflict do nothing;
  return cid;
end;
$$;

create or replace function public.touch_streak()
returns table(current_streak integer,longest_streak integer) language plpgsql security definer set search_path=public as $$
declare s public.user_streaks%rowtype;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  insert into public.user_streaks(user_id,current_streak,longest_streak,last_active_date)
  values(auth.uid(),1,1,current_date)
  on conflict(user_id) do update set
    current_streak=case
      when user_streaks.last_active_date=current_date then user_streaks.current_streak
      when user_streaks.last_active_date=current_date-1 then user_streaks.current_streak+1
      else 1 end,
    longest_streak=greatest(user_streaks.longest_streak,case
      when user_streaks.last_active_date=current_date then user_streaks.current_streak
      when user_streaks.last_active_date=current_date-1 then user_streaks.current_streak+1
      else 1 end),
    last_active_date=current_date,updated_at=now()
  returning * into s;
  return query select s.current_streak,s.longest_streak;
end;
$$;

create or replace view public.resource_quality as
select r.id as resource_id,
  count(f.*) filter(where f.helpful) as helpful_count,
  count(f.*) filter(where not f.helpful) as not_helpful_count,
  case when count(f.*)=0 then null else round(100.0*count(f.*) filter(where f.helpful)/count(f.*)) end as helpful_percent
from public.resources r left join public.resource_feedback f on f.resource_id=r.id
group by r.id;

grant select on public.resource_quality to anon, authenticated;
grant execute on function public.join_classroom(text) to authenticated;
grant execute on function public.touch_streak() to authenticated;

alter table public.user_courses enable row level security;
alter table public.course_progress enable row level security;
alter table public.study_tasks enable row level security;
alter table public.recent_views enable row level security;
alter table public.resource_feedback enable row level security;
alter table public.resource_reports enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.collection_saves enable row level security;
alter table public.flashcard_decks enable row level security;
alter table public.flashcards enable row level security;
alter table public.flashcard_reviews enable row level security;
alter table public.practice_questions enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.classrooms enable row level security;
alter table public.classroom_members enable row level security;
alter table public.classroom_resources enable row level security;
alter table public.discussion_posts enable row level security;
alter table public.post_replies enable row level security;
alter table public.user_streaks enable row level security;

do $$ declare t text; begin
  foreach t in array array['user_courses','course_progress','study_tasks','recent_views','resource_feedback','resource_reports','collection_saves','practice_attempts','flashcard_reviews','user_streaks'] loop
    execute format('drop policy if exists own_all on public.%I',t);
    execute format('create policy own_all on public.%I for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid())',t);
  end loop;
end $$;

drop policy if exists collections_read on public.collections;
create policy collections_read on public.collections for select using (is_public or owner_id=auth.uid() or public.is_admin());
drop policy if exists collections_write on public.collections;
create policy collections_write on public.collections for all to authenticated using (owner_id=auth.uid() or public.is_admin()) with check (owner_id=auth.uid() or public.is_admin());

drop policy if exists collection_items_read on public.collection_items;
create policy collection_items_read on public.collection_items for select using (exists(select 1 from public.collections c where c.id=collection_id and (c.is_public or c.owner_id=auth.uid())));
drop policy if exists collection_items_write on public.collection_items;
create policy collection_items_write on public.collection_items for all to authenticated using (exists(select 1 from public.collections c where c.id=collection_id and c.owner_id=auth.uid())) with check (exists(select 1 from public.collections c where c.id=collection_id and c.owner_id=auth.uid()));

drop policy if exists decks_read on public.flashcard_decks;
create policy decks_read on public.flashcard_decks for select using (is_public or owner_id=auth.uid());
drop policy if exists decks_write on public.flashcard_decks;
create policy decks_write on public.flashcard_decks for all to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
drop policy if exists cards_read on public.flashcards;
create policy cards_read on public.flashcards for select using (exists(select 1 from public.flashcard_decks d where d.id=deck_id and (d.is_public or d.owner_id=auth.uid())));
drop policy if exists cards_write on public.flashcards;
create policy cards_write on public.flashcards for all to authenticated using (exists(select 1 from public.flashcard_decks d where d.id=deck_id and d.owner_id=auth.uid())) with check (exists(select 1 from public.flashcard_decks d where d.id=deck_id and d.owner_id=auth.uid()));

drop policy if exists questions_read on public.practice_questions;
create policy questions_read on public.practice_questions for select using (is_published or public.is_admin());
drop policy if exists questions_admin on public.practice_questions;
create policy questions_admin on public.practice_questions for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists classrooms_read on public.classrooms;
create policy classrooms_read on public.classrooms for select using (public.can_view_classroom(id));
drop policy if exists classrooms_create on public.classrooms;
create policy classrooms_create on public.classrooms for insert to authenticated with check (owner_id=auth.uid());
drop policy if exists classrooms_manage on public.classrooms;
create policy classrooms_manage on public.classrooms for update to authenticated using (public.can_manage_classroom(id)) with check (public.can_manage_classroom(id));
drop policy if exists classrooms_delete on public.classrooms;
create policy classrooms_delete on public.classrooms for delete to authenticated using (owner_id=auth.uid() or public.is_admin());

drop policy if exists members_read on public.classroom_members;
create policy members_read on public.classroom_members for select using (public.can_view_classroom(classroom_id));
drop policy if exists members_manage on public.classroom_members;
create policy members_manage on public.classroom_members for all to authenticated using (user_id=auth.uid() or public.can_manage_classroom(classroom_id)) with check (user_id=auth.uid() or public.can_manage_classroom(classroom_id));
drop policy if exists classroom_resources_read on public.classroom_resources;
create policy classroom_resources_read on public.classroom_resources for select using (public.can_view_classroom(classroom_id));
drop policy if exists classroom_resources_manage on public.classroom_resources;
create policy classroom_resources_manage on public.classroom_resources for all to authenticated using (public.can_manage_classroom(classroom_id)) with check (public.can_manage_classroom(classroom_id));

drop policy if exists posts_read on public.discussion_posts;
create policy posts_read on public.discussion_posts for select using (classroom_id is null or public.can_view_classroom(classroom_id));
drop policy if exists posts_create on public.discussion_posts;
create policy posts_create on public.discussion_posts for insert to authenticated with check (author_id=auth.uid() and (classroom_id is null or public.can_view_classroom(classroom_id)));
drop policy if exists posts_manage on public.discussion_posts;
create policy posts_manage on public.discussion_posts for update to authenticated using (author_id=auth.uid() or public.is_admin()) with check (author_id=auth.uid() or public.is_admin());
drop policy if exists posts_delete on public.discussion_posts;
create policy posts_delete on public.discussion_posts for delete to authenticated using (author_id=auth.uid() or public.is_admin());
drop policy if exists replies_read on public.post_replies;
create policy replies_read on public.post_replies for select using (exists(select 1 from public.discussion_posts p where p.id=post_id and (p.classroom_id is null or public.can_view_classroom(p.classroom_id))));
drop policy if exists replies_create on public.post_replies;
create policy replies_create on public.post_replies for insert to authenticated with check (author_id=auth.uid());
drop policy if exists replies_manage on public.post_replies;
create policy replies_manage on public.post_replies for update to authenticated using (author_id=auth.uid() or public.is_admin()) with check (author_id=auth.uid() or public.is_admin());
drop policy if exists replies_delete on public.post_replies;
create policy replies_delete on public.post_replies for delete to authenticated using (author_id=auth.uid() or public.is_admin());

-- Optional quality metadata added without breaking existing resource inserts.
alter table public.resources add column if not exists difficulty text;
alter table public.resources add column if not exists estimated_minutes integer;
alter table public.resources add column if not exists verified_at timestamptz;
alter table public.resources add column if not exists reviewed_at timestamptz;
alter table public.resources add column if not exists teacher_recommended boolean not null default false;
alter table public.resources drop constraint if exists resources_difficulty_check;
alter table public.resources add constraint resources_difficulty_check check (difficulty is null or difficulty in ('beginner','intermediate','advanced'));
alter table public.resources drop constraint if exists resources_estimated_minutes_check;
alter table public.resources add constraint resources_estimated_minutes_check check (estimated_minutes is null or estimated_minutes between 1 and 1440);

-- Add your own copyrighted-safe questions in the admin workflow. This starter
-- inserts one general study-skills question only when the question bank is empty.
insert into public.practice_questions(course_id,unit_number,prompt,choices,correct_index,explanation,difficulty,source_label)
select null,null,'Which study approach best supports long-term retention?',
  '["Rereading the same page repeatedly","Spacing practice across several days","Studying only the night before","Highlighting every sentence"]'::jsonb,
  1,'Spaced practice requires recalling material over time, which strengthens long-term retention.','easy','AP Study Hub'
where not exists(select 1 from public.practice_questions);

-- Approved-teacher rank and final classroom security policies.
-- This section intentionally runs last so it replaces earlier broad classroom
-- policies with the least-privilege versions used by the current frontend.
create table if not exists public.teacher_applications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  statement text not null check (char_length(statement) between 20 and 1200),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);
create index if not exists teacher_applications_status_idx on public.teacher_applications(status,submitted_at);
alter table public.teacher_applications enable row level security;

drop policy if exists teacher_applications_read on public.teacher_applications;
create policy teacher_applications_read on public.teacher_applications for select to authenticated using (user_id=auth.uid() or public.is_admin());
drop policy if exists teacher_applications_apply on public.teacher_applications;
create policy teacher_applications_apply on public.teacher_applications for insert to authenticated with check (user_id=auth.uid() and status='pending' and reviewed_at is null and reviewed_by is null);
drop policy if exists teacher_applications_admin_update on public.teacher_applications;
create policy teacher_applications_admin_update on public.teacher_applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists teacher_applications_admin_delete on public.teacher_applications;
create policy teacher_applications_admin_delete on public.teacher_applications for delete to authenticated using (public.is_admin());

create or replace function public.is_approved_teacher()
returns boolean language sql stable security definer set search_path=public as $$
  select public.is_admin() or exists(select 1 from public.teacher_applications where user_id=auth.uid() and status='approved');
$$;

create or replace function public.review_teacher_application(applicant uuid, decision text)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if decision not in ('approved','rejected') then raise exception 'Decision must be approved or rejected'; end if;
  update public.teacher_applications set status=decision,reviewed_at=now(),reviewed_by=auth.uid() where user_id=applicant;
  if not found then raise exception 'Teacher application not found'; end if;
end;
$$;

create or replace function public.protect_classroom_owner()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.owner_id is distinct from old.owner_id and not public.is_admin() then raise exception 'Only an admin can transfer classroom ownership'; end if;
  return new;
end;
$$;
drop trigger if exists protect_classroom_owner_trigger on public.classrooms;
create trigger protect_classroom_owner_trigger before update of owner_id on public.classrooms for each row execute function public.protect_classroom_owner();

grant execute on function public.is_approved_teacher() to authenticated;
grant execute on function public.review_teacher_application(uuid,text) to authenticated;

drop policy if exists classrooms_create on public.classrooms;
create policy classrooms_create on public.classrooms for insert to authenticated with check (owner_id=auth.uid() and public.is_approved_teacher());
drop policy if exists classrooms_manage on public.classrooms;
create policy classrooms_manage on public.classrooms for update to authenticated using (public.can_manage_classroom(id)) with check (public.can_manage_classroom(id));

drop policy if exists members_manage on public.classroom_members;
drop policy if exists members_insert on public.classroom_members;
drop policy if exists members_update on public.classroom_members;
drop policy if exists members_delete on public.classroom_members;
create policy members_insert on public.classroom_members for insert to authenticated with check ((user_id=auth.uid() and member_role='student') or public.can_manage_classroom(classroom_id));
create policy members_update on public.classroom_members for update to authenticated using (public.can_manage_classroom(classroom_id)) with check (public.can_manage_classroom(classroom_id));
create policy members_delete on public.classroom_members for delete to authenticated using (user_id=auth.uid() or public.can_manage_classroom(classroom_id));

drop policy if exists replies_create on public.post_replies;
create policy replies_create on public.post_replies for insert to authenticated with check (
  author_id=auth.uid() and exists(
    select 1 from public.discussion_posts p where p.id=post_id and (p.classroom_id is null or public.can_view_classroom(p.classroom_id))
  )
);

select 'AP Study Hub product and teacher-security upgrade installed successfully' as result;
