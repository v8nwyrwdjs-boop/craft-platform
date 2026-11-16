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

alter table public.profiles enable row level security;
alter table public.student_projects enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

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

drop policy if exists "Users can read their own lesson progress" on public.lesson_progress;
create policy "Users can read their own lesson progress" on public.lesson_progress for select to authenticated using (auth.uid() = student_id);
drop policy if exists "Users can create their own lesson progress" on public.lesson_progress;
create policy "Users can create their own lesson progress" on public.lesson_progress for insert to authenticated with check (auth.uid() = student_id and exists (select 1 from public.enrollments e where e.student_id = auth.uid() and e.program_slug = lesson_progress.program_slug and e.status = 'active'));
drop policy if exists "Users can update their own lesson progress" on public.lesson_progress;
create policy "Users can update their own lesson progress" on public.lesson_progress for update to authenticated using (auth.uid() = student_id and exists (select 1 from public.enrollments e where e.student_id = auth.uid() and e.program_slug = lesson_progress.program_slug and e.status = 'active')) with check (auth.uid() = student_id);

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
