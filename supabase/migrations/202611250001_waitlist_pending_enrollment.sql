-- Список ожидания: ученик может создать только заявку (status = 'pending') на продукт из каталога.
-- Заявка не даёт доступа: уроки, сдачи и прогресс по-прежнему требуют status = 'active',
-- а менять или удалять запись может только администратор (политика "Admins can manage enrollments").
-- Не более 40 записей на ученика, чтобы одна учётная запись не засоряла таблицу.
drop policy if exists "Users can join the waitlist" on public.enrollments;
create policy "Users can join the waitlist" on public.enrollments
  for insert to authenticated
  with check (
    auth.uid() = student_id
    and status = 'pending'
    and program_slug ~ '^[a-z0-9-]{2,40}$'
    and (select count(*) from public.enrollments e where e.student_id = auth.uid()) < 40
  );
