import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const schema = readFileSync(new URL("../../supabase/schema.sql", import.meta.url), "utf8");

test("all student data tables have row-level security enabled", () => {
  for (const table of [
    "profiles",
    "student_projects",
    "enrollments",
    "lesson_progress",
    "assignment_submissions",
    "mentor_feedback",
  ]) {
    assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security`, "i"), table);
  }
});

test("student-owned records are scoped to the authenticated user", () => {
  for (const table of [
    "profiles",
    "student_projects",
    "enrollments",
    "lesson_progress",
    "assignment_submissions",
    "mentor_feedback",
  ]) {
    assert.match(
      schema,
      new RegExp(`create policy "[^"]+" on public\\.${table} for select to authenticated using \\(auth\\.uid\\(\\) = (?:id|student_id)\\)`, "i"),
      `missing owner-scoped read policy for ${table}`,
    );
  }
});

test("staff roles are read from trusted app_metadata claims", () => {
  assert.match(schema, /auth\.jwt\(\) -> 'app_metadata' ->> 'role'/);
  assert.doesNotMatch(schema, /auth\.jwt\(\) -> 'user_metadata' ->> 'role'/);
});

test("mentors can read enrollment status but cannot manage enrollments", () => {
  assert.match(schema, /create policy "Staff can read all enrollments" on public\.enrollments for select/i);
  assert.match(schema, /create policy "Admins can manage enrollments" on public\.enrollments for all/i);
});

test("students cannot grant themselves enrollments and staff can only update submission status", () => {
  assert.match(schema, /create policy "Admins can manage enrollments" on public\.enrollments for all/i);
  assert.match(schema, /revoke update on public\.assignment_submissions from authenticated/i);
  assert.match(schema, /grant update \(status\) on public\.assignment_submissions to authenticated/i);
});

const waitlistMigration = readFileSync(new URL("../../supabase/migrations/202611250001_waitlist_pending_enrollment.sql", import.meta.url), "utf8");

test("students can only create pending waitlist requests, never an active enrollment", () => {
  for (const source of [schema, waitlistMigration]) {
    const match = source.match(/create policy "Users can join the waitlist" on public\.enrollments\s+for insert to authenticated\s+with check \(([\s\S]*?)\);/i);
    assert.ok(match, "waitlist insert policy is missing");
    assert.match(match[1], /auth\.uid\(\) = student_id/);
    assert.match(match[1], /status = 'pending'/);
    assert.doesNotMatch(match[1], /'active'|'completed'/);
  }
});

test("only the waitlist insert and the admin policy can write enrollments", () => {
  const writers = [...schema.matchAll(/create policy "([^"]+)" on public\.enrollments\s+for (insert|update|delete|all)/gi)].map((match) => match[1]).sort();
  assert.deepEqual(writers, ["Admins can manage enrollments", "Users can join the waitlist"]);
});

test("learning access still requires an active enrollment, a pending request opens nothing", () => {
  assert.match(schema, /create policy "Enrolled users can submit assignments"[\s\S]*?e\.status = 'active'/i);
  assert.match(schema, /create policy "Users can create their own lesson progress"[\s\S]*?e\.status = 'active'/i);
});
