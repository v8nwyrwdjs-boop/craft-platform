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

test("rejects dot-segment tricks that normalise into a protocol-relative URL", () => {
  for (const value of [
    "/..//evil.example",
    "/.//evil.example",
    "/%2e%2e//evil.example",
    "/%2E%2E/%2e%2e//evil.example",
    "/a/../..//evil.example",
    "/./..//evil.example",
  ]) {
    assert.equal(safeInternalPath(value), "/dashboard", value);
  }
});

test("resolves harmless dot segments to a same-site path", () => {
  assert.equal(safeInternalPath("/learn/../dashboard?x=1"), "/dashboard?x=1");
});

test("never returns a value that starts with two slashes or contains a backslash", () => {
  const tokens = [".", "..", "%2e", "%2e%2e", ".%2e", "", "a"];
  const build = (depth, prefix, out) => {
    out.push(prefix);
    if (depth === 0) return;
    for (const token of tokens) build(depth - 1, prefix + "/" + token, out);
  };
  const samples = [];
  build(4, "", samples);
  assert.ok(samples.length > 2000);
  for (const value of samples) {
    const result = safeInternalPath(value);
    assert.ok(result.startsWith("/") && !result.startsWith("//") && !result.includes("\\"), value + " -> " + result);
  }
});
