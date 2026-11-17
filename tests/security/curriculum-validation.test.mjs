import test from "node:test";
import assert from "node:assert/strict";
import { isValidLessonForModule, isValidLessonSlug } from "../../lib/curriculum-validation.ts";

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
