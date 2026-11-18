-- Enforce the published curriculum at the database boundary as well as in server actions.
-- NOT VALID keeps existing rows untouched while enforcing the rule for new/changed rows.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'lesson_progress_known_curriculum'
      and conrelid = 'public.lesson_progress'::regclass
  ) then
    alter table public.lesson_progress
      add constraint lesson_progress_known_curriculum
      check (
        program_slug = 'craft-foundation'
        and lesson_slug in (
          'idea-1','idea-2','idea-3',
          'research-1','research-2','research-3',
          'validation-1','validation-2','validation-3',
          'business-model-1','business-model-2','business-model-3',
          'mvp-1','mvp-2','mvp-3',
          'launch-1','launch-2','launch-3'
        )
        and (status <> 'completed' or completed_at is not null)
      ) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'assignment_submissions_known_curriculum'
      and conrelid = 'public.assignment_submissions'::regclass
  ) then
    alter table public.assignment_submissions
      add constraint assignment_submissions_known_curriculum
      check (
        program_slug = 'craft-foundation'
        and lesson_slug in (
          'idea-1','idea-2','idea-3',
          'research-1','research-2','research-3',
          'validation-1','validation-2','validation-3',
          'business-model-1','business-model-2','business-model-3',
          'mvp-1','mvp-2','mvp-3',
          'launch-1','launch-2','launch-3'
        )
      ) not valid;
  end if;
end;
$$;
