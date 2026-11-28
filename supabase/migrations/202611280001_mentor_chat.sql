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
