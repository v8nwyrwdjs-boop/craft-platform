-- Mentors may view enrollment status for learner support, but only admins may manage access.
drop policy if exists "Staff can read all enrollments" on public.enrollments;
create policy "Staff can read all enrollments" on public.enrollments
  for select to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'mentor'));
