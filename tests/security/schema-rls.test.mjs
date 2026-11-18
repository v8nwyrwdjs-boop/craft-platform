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
