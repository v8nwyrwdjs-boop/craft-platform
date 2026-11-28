-- CRAFT student platform schema
-- Apply once in Supabase SQL Editor. Safe to re-run: policies and trigger are recreated.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 140),
  origin_type text not null default 'own_idea' check (origin_type in ('own_idea', 'direction', 'concept')),
  origin_slug text,
  stage text not null default 'Идея',
  status text not null default 'В работе',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists student_projects_student_updated_idx on public.student_projects(student_id, updated_at desc);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  program_slug text not null default 'craft-foundation',
  status text not null default 'active' check (status in ('pending', 'active', 'completed', 'cancelled')),
  enrolled_at timestamptz not null default now(),
  unique(student_id, program_slug)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  program_slug text not null default 'craft-foundation',
  lesson_slug text not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(student_id, program_slug, lesson_slug)
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  program_slug text not null default 'craft-foundation',
  lesson_slug text not null,
  response text not null check (char_length(response) between 20 and 20000),
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'revision_requested', 'accepted')),
  submitted_at timestamptz not null default now()
);
create index if not exists assignment_submissions_student_lesson_idx on public.assignment_submissions(student_id, lesson_slug, submitted_at desc);

create table if not exists public.mentor_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.assignment_submissions(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  mentor_id uuid not null references auth.users(id),
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.student_projects enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.mentor_feedback enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can read their own projects" on public.student_projects;
create policy "Users can read their own projects" on public.student_projects for select to authenticated using (auth.uid() = student_id);
drop policy if exists "Users can create their own projects" on public.student_projects;
create policy "Users can create their own projects" on public.student_projects for insert to authenticated with check (auth.uid() = student_id);
drop policy if exists "Users can update their own projects" on public.student_projects;
create policy "Users can update their own projects" on public.student_projects for update to authenticated using (auth.uid() = student_id) with check (auth.uid() = student_id);
drop policy if exists "Users can delete their own projects" on public.student_projects;
create policy "Users can delete their own projects" on public.student_projects for delete to authenticated using (auth.uid() = student_id);

drop policy if exists "Users can read their own enrollments" on public.enrollments;
create policy "Users can read their own enrollments" on public.enrollments for select to authenticated using (auth.uid() = student_id);

drop policy if exists "Staff can read all enrollments" on public.enrollments;
create policy "Staff can read all enrollments" on public.enrollments for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));

-- Список ожидания: ученик создаёт только заявку со статусом pending; доступ (active) выдаёт администратор.
drop policy if exists "Users can join the waitlist" on public.enrollments;
create policy "Users can join the waitlist" on public.enrollments
  for insert to authenticated
  with check (
    auth.uid() = student_id
    and status = 'pending'
    and program_slug ~ '^[a-z0-9-]{2,40}$'
    and (select count(*) from public.enrollments e where e.student_id = auth.uid()) < 40
  );

drop policy if exists "Users can read their own lesson progress" on public.lesson_progress;
create policy "Users can read their own lesson progress" on public.lesson_progress for select to authenticated using (auth.uid() = student_id);

drop policy if exists "Users can read their own submissions" on public.assignment_submissions;
create policy "Users can read their own submissions" on public.assignment_submissions for select to authenticated using (auth.uid() = student_id);
drop policy if exists "Enrolled users can submit assignments" on public.assignment_submissions;
create policy "Enrolled users can submit assignments" on public.assignment_submissions for insert to authenticated with check (auth.uid() = student_id and status = 'submitted' and exists (select 1 from public.enrollments e where e.student_id = auth.uid() and e.program_slug = assignment_submissions.program_slug and e.status = 'active'));
drop policy if exists "Students can read their own mentor feedback" on public.mentor_feedback;
create policy "Students can read their own mentor feedback" on public.mentor_feedback for select to authenticated using (auth.uid() = student_id);
drop policy if exists "Users can create their own lesson progress" on public.lesson_progress;
create policy "Users can create their own lesson progress" on public.lesson_progress for insert to authenticated with check (auth.uid() = student_id and exists (select 1 from public.enrollments e where e.student_id = auth.uid() and e.program_slug = lesson_progress.program_slug and e.status = 'active'));
drop policy if exists "Users can update their own lesson progress" on public.lesson_progress;
create policy "Users can update their own lesson progress" on public.lesson_progress for update to authenticated using (auth.uid() = student_id and exists (select 1 from public.enrollments e where e.student_id = auth.uid() and e.program_slug = lesson_progress.program_slug and e.status = 'active')) with check (auth.uid() = student_id and exists (select 1 from public.enrollments e where e.student_id = auth.uid() and e.program_slug = lesson_progress.program_slug and e.status = 'active'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Staff permissions are based only on trusted app_metadata claims.
-- Set app_metadata.role to "admin" or "mentor" from a trusted Supabase admin context.
drop policy if exists "Staff can read all profiles" on public.profiles;
create policy "Staff can read all profiles" on public.profiles for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));

drop policy if exists "Staff can read all projects" on public.student_projects;
create policy "Staff can read all projects" on public.student_projects for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));
drop policy if exists "Staff can update all projects" on public.student_projects;
create policy "Staff can update all projects" on public.student_projects for update to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor')) with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));

drop policy if exists "Admins can manage enrollments" on public.enrollments;
create policy "Admins can manage enrollments" on public.enrollments for all to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Staff can read all lesson progress" on public.lesson_progress;
create policy "Staff can read all lesson progress" on public.lesson_progress for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));

drop policy if exists "Staff can read all submissions" on public.assignment_submissions;
create policy "Staff can read all submissions" on public.assignment_submissions for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));
drop policy if exists "Staff can review submissions" on public.assignment_submissions;
create policy "Staff can review submissions" on public.assignment_submissions for update to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor')) with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));

-- Staff may change only the review status, never student content or ownership.
revoke update on public.assignment_submissions from authenticated;
grant update (status) on public.assignment_submissions to authenticated;

drop policy if exists "Staff can read all mentor feedback" on public.mentor_feedback;
create policy "Staff can read all mentor feedback" on public.mentor_feedback for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));
drop policy if exists "Staff can create mentor feedback" on public.mentor_feedback;
create policy "Staff can create mentor feedback" on public.mentor_feedback for insert to authenticated with check (
  (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor')
  and mentor_id = auth.uid()
  and exists (
    select 1 from public.assignment_submissions s
    where s.id = mentor_feedback.submission_id and s.student_id = mentor_feedback.student_id
  )
);


-- Keep lesson and assignment identifiers aligned with lib/curriculum.ts.
-- NOT VALID preserves existing rows while protecting all new and changed rows.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'lesson_progress_known_curriculum' and conrelid = 'public.lesson_progress'::regclass) then
    alter table public.lesson_progress add constraint lesson_progress_known_curriculum
      check (program_slug = 'craft-foundation' and lesson_slug in (
        'idea-1','idea-2','idea-3','research-1','research-2','research-3',
        'validation-1','validation-2','validation-3','business-model-1','business-model-2','business-model-3',
        'mvp-1','mvp-2','mvp-3','launch-1','launch-2','launch-3'
      ) and (status <> 'completed' or completed_at is not null)) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'assignment_submissions_known_curriculum' and conrelid = 'public.assignment_submissions'::regclass) then
    alter table public.assignment_submissions add constraint assignment_submissions_known_curriculum
      check (program_slug = 'craft-foundation' and lesson_slug in (
        'idea-1','idea-2','idea-3','research-1','research-2','research-3',
        'validation-1','validation-2','validation-3','business-model-1','business-model-2','business-model-3',
        'mvp-1','mvp-2','mvp-3','launch-1','launch-2','launch-3'
      )) not valid;
  end if;
end;
$$;



-- ---- Чат ученик ↔ команда (миграция 202611280001_mentor_chat.sql) ----
-- Чат «ученик ↔ команда CRAFT» (наставники и администраторы). Применяет владелец проекта.
-- Безопасно запускать повторно: таблицы, политики и триггер пересоздаются.
--
-- Правила доступа:
--  * ветку чата создаёт только администратор и только для ученика с активной записью (status = 'active');
--  * ученик видит и пишет только в своей открытой ветке, команда (admin/mentor) видит и отвечает во всех;
--  * роль берётся только из доверенного app_metadata, сообщения неизменяемы, удалить их из приложения нельзя;
--  * время, id и счётчики ставит база: клиенту выданы права на вставку только четырёх колонок;
--  * частота: ученик — не больше 12 сообщений в минуту и 400 в сутки, команда — 30 в минуту.
-- Realtime не используется (это настройка проекта): страница обновляется опросом раз в 20 секунд.

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references auth.users(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'closed')),
  opened_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  last_message_at timestamptz,
  last_author_kind text check (last_author_kind in ('student', 'staff'))
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_kind text not null check (author_kind in ('student', 'staff')),
  body text not null check (char_length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_thread_created_idx on public.chat_messages(thread_id, created_at desc);
create index if not exists chat_messages_author_created_idx on public.chat_messages(author_id, created_at desc);

create table if not exists public.chat_reads (
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (thread_id, user_id)
);

-- Счётчик собственных сообщений для лимита частоты. Нужна функция SECURITY DEFINER: политика вставки в
-- chat_messages не может сама выбирать из chat_messages, пока у этой таблицы есть политики с подзапросами
-- (Postgres: "infinite recursion detected in policy", проверено на реальной базе).
-- Функция считает только сообщения вызывающего (auth.uid()), чужие счётчики через неё узнать нельзя.
create or replace function public.my_chat_message_count(p_window interval)
returns integer
language sql
stable
security definer set search_path = ''
as $$
  select count(*)::integer from public.chat_messages m
  where m.author_id = (select auth.uid()) and m.created_at > now() - p_window
$$;
revoke all on function public.my_chat_message_count(interval) from public, anon;
grant execute on function public.my_chat_message_count(interval) to authenticated;

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_reads enable row level security;

-- Ветки
drop policy if exists "Students can read their own chat thread" on public.chat_threads;
create policy "Students can read their own chat thread" on public.chat_threads for select to authenticated using (auth.uid() = student_id);
drop policy if exists "Staff can read all chat threads" on public.chat_threads;
create policy "Staff can read all chat threads" on public.chat_threads for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));
drop policy if exists "Admins can open chat threads" on public.chat_threads;
create policy "Admins can open chat threads" on public.chat_threads for insert to authenticated with check (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and opened_by = auth.uid()
  and status = 'open'
  and last_message_at is null
  and last_author_kind is null
  and exists (select 1 from public.enrollments e where e.student_id = chat_threads.student_id and e.status = 'active')
);
drop policy if exists "Admins can close and reopen chat threads" on public.chat_threads;
create policy "Admins can close and reopen chat threads" on public.chat_threads for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
revoke insert, update, delete on public.chat_threads from authenticated;
grant insert (student_id, opened_by) on public.chat_threads to authenticated;
grant update (status) on public.chat_threads to authenticated;

-- Сообщения
drop policy if exists "Students can read their own chat messages" on public.chat_messages;
create policy "Students can read their own chat messages" on public.chat_messages for select to authenticated using (
  exists (select 1 from public.chat_threads t where t.id = chat_messages.thread_id and t.student_id = auth.uid())
);
drop policy if exists "Staff can read all chat messages" on public.chat_messages;
create policy "Staff can read all chat messages" on public.chat_messages for select to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));
drop policy if exists "Students can write in their open chat thread" on public.chat_messages;
create policy "Students can write in their open chat thread" on public.chat_messages for insert to authenticated with check (
  author_kind = 'student'
  and author_id = auth.uid()
  and exists (select 1 from public.chat_threads t where t.id = chat_messages.thread_id and t.student_id = auth.uid() and t.status = 'open')
  and exists (select 1 from public.enrollments e where e.student_id = auth.uid() and e.status = 'active')
  and public.my_chat_message_count(interval '1 minute') < 12
  and public.my_chat_message_count(interval '1 day') < 400
);
drop policy if exists "Staff can reply in open chat threads" on public.chat_messages;
create policy "Staff can reply in open chat threads" on public.chat_messages for insert to authenticated with check (
  author_kind = 'staff'
  and author_id = auth.uid()
  and (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor')
  and exists (select 1 from public.chat_threads t where t.id = chat_messages.thread_id and t.student_id <> auth.uid() and t.status = 'open')
  and public.my_chat_message_count(interval '1 minute') < 30
);
revoke insert, update, delete on public.chat_messages from authenticated;
grant insert (thread_id, author_id, author_kind, body) on public.chat_messages to authenticated;

-- Отметки «прочитано»: каждый видит и меняет только свои, и только для доступных ему веток.
drop policy if exists "Users can read their own chat read marks" on public.chat_reads;
create policy "Users can read their own chat read marks" on public.chat_reads for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can mark their visible chat threads as read" on public.chat_reads;
create policy "Users can mark their visible chat threads as read" on public.chat_reads for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.chat_threads t where t.id = chat_reads.thread_id)
);
drop policy if exists "Users can update their own chat read marks" on public.chat_reads;
create policy "Users can update their own chat read marks" on public.chat_reads for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
revoke insert, update, delete on public.chat_reads from authenticated;
grant insert (thread_id, user_id, last_read_at) on public.chat_reads to authenticated;
grant update (last_read_at) on public.chat_reads to authenticated;

-- Последнее сообщение и его автор хранятся в ветке (для списка «ждёт ответа»); пишет только триггер.
create or replace function public.touch_chat_thread()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.chat_threads
     set last_message_at = new.created_at, last_author_kind = new.author_kind
   where id = new.thread_id;
  return new;
end;
$$;
revoke all on function public.touch_chat_thread() from public, anon, authenticated;

drop trigger if exists on_chat_message_created on public.chat_messages;
create trigger on_chat_message_created after insert on public.chat_messages for each row execute procedure public.touch_chat_thread();
