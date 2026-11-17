-- Restrict staff review updates to the status column only.
-- Apply this migration in Supabase when the database change is approved.
revoke update on public.assignment_submissions from authenticated;
grant update (status) on public.assignment_submissions to authenticated;
