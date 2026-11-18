import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { curriculum, isValidLessonForModule, isValidLessonSlug } from "../../lib/curriculum.ts";

test("accepts all known lesson identifiers", () => {
  for (const module of ["idea", "research", "validation", "business-model", "mvp", "launch"]) {
    for (let lesson = 1; lesson <= 3; lesson += 1) {
      assert.equal(isValidLessonSlug(`${module}-${lesson}`), true);
      assert.equal(isValidLessonForModule(`${module}-${lesson}`, module), true);
    }
  }
});

test("rejects unknown modules and out-of-range lessons", () => {
  for (const slug of ["unknown-1", "idea-4", "research-0", "mvp-10", "idea-one", "../idea-1", "idea-1/../admin"]) {
    assert.equal(isValidLessonSlug(slug), false, slug);
  }
});

test("requires the submitted lesson to belong to the selected module", () => {
  assert.equal(isValidLessonForModule("idea-1", "idea"), true);
  assert.equal(isValidLessonForModule("idea-1", "research"), false);
  assert.equal(isValidLessonForModule("business-model-2", "business-model"), true);
  assert.equal(isValidLessonForModule("business-model-2", "business"), false);
});

test("every lesson has a concrete task and a defined deliverable", () => {
  assert.equal(curriculum.length, 6);
  for (const module of curriculum) {
    assert.equal(module.lessons.length, 3, module.slug);
    for (const lesson of module.lessons) {
      assert.ok(lesson.title.length >= 5, `${module.slug}: missing title`);
      assert.ok(lesson.body.length >= 100, `${module.slug}: lesson explanation is too short`);
      assert.ok(lesson.task.length >= 20, `${module.slug}: missing task`);
      assert.ok(lesson.deliverable.length >= 20, `${module.slug}: missing deliverable`);
    }
  }
});

test("database schema and migration enforce the canonical curriculum", () => {
  const schema = readFileSync(new URL("../../supabase/schema.sql", import.meta.url), "utf8");
  const migration = readFileSync(new URL("../../supabase/migrations/202611180001_enforce_curriculum_integrity.sql", import.meta.url), "utf8");

  for (const module of curriculum) {
    for (let index = 1; index <= module.lessons.length; index += 1) {
      const slug = `${module.slug}-${index}`;
      assert.ok(schema.includes(`'${slug}'`), `schema is missing ${slug}`);
      assert.ok(migration.includes(`'${slug}'`), `migration is missing ${slug}`);
    }
  }

  assert.match(schema, /lesson_progress_known_curriculum/);
  assert.match(schema, /assignment_submissions_known_curriculum/);
  assert.match(migration, /lesson_progress_known_curriculum/);
  assert.match(migration, /assignment_submissions_known_curriculum/);
  assert.match(migration, /not valid/i);
});
