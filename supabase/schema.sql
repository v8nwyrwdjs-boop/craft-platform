-- CRAFT student account foundation
-- Run in the Supabase SQL Editor for the project connected to this application.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  origin_type text not null default 'own_idea' check (origin_type in ('own_idea', 'direction', 'concept')),
  origin_slug text,
  stage text not null default 'Идея',
  status text not null default 'В работе',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.student_projects enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can read their own projects"
  on public.student_projects for select to authenticated using (auth.uid() = student_id);
create policy "Users can create their own projects"
  on public.student_projects for insert to authenticated with check (auth.uid() = student_id);
create policy "Users can update their own projects"
  on public.student_projects for update to authenticated using (auth.uid() = student_id) with check (auth.uid() = student_id);
create policy "Users can delete their own projects"
  on public.student_projects for delete to authenticated using (auth.uid() = student_id);

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
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
