import test from "node:test";
import assert from "node:assert/strict";
import { safeInternalPath } from "../../lib/safe-internal-path.ts";

test("keeps safe same-site paths and their query/hash", () => {
  assert.equal(safeInternalPath("/dashboard?tab=projects#latest"), "/dashboard?tab=projects#latest");
});

test("rejects external, protocol-relative, and backslash redirect targets", () => {
  for (const value of ["https://evil.example", "//evil.example/path", "/\\\\evil.example", "javascript:alert(1)"]) {
    assert.equal(safeInternalPath(value), "/dashboard");
  }
});

test("rejects control characters", () => {
  assert.equal(safeInternalPath("/dashboard\nLocation: https://evil.example"), "/dashboard");
});
