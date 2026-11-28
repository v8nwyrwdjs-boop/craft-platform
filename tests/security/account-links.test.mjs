import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "..");
const read = (file) => readFileSync(join(root, file), "utf8");

test("account links read the session cookie in the browser only", () => {
  const links = read("components/account-links.tsx");
  assert.ok(links.startsWith('"use client"'), "client component");
  assert.ok(links.includes("useSyncExternalStore"), "hydration-safe external read");
  assert.ok(/,\s*\(\)\s*=>\s*false\s*\)/.test(links), "the server snapshot is always signed out");
  assert.ok(!links.includes("next/headers") && !links.includes("lib/supabase"), "no server access");
});

test("the session cookie pattern matches Supabase auth cookies and nothing else", () => {
  const source = read("components/account-links.tsx").match(/const SESSION_COOKIE = \/(.+)\/;/);
  assert.ok(source, "pattern is declared as a literal");
  const re = new RegExp(source[1]);
  assert.ok(re.test("theme=dark; sb-abcdefgh-auth-token=base64-eyJ"));
  assert.ok(re.test("sb-abcdefgh-auth-token.0=aaa; sb-abcdefgh-auth-token.1=bbb"));
  assert.ok(!re.test("sb-abcdefgh-auth-token-code-verifier=xyz"));
  assert.ok(!re.test("theme=dark; sidebar=1"));
});

test("header and footer use the shared link and the layout stays static", () => {
  for (const file of ["components/site-header.tsx", "components/site-footer.tsx"]) {
    const source = read(file);
    assert.ok(source.includes("AccountLink"), `${file} uses AccountLink`);
    assert.ok(!source.includes('href="/login"'), `${file} has no hard-coded login link`);
  }
  const layout = read("app/(site)/layout.tsx");
  assert.ok(!layout.includes("next/headers") && !layout.includes("lib/supabase"), "layout does not read the session on the server");
});
