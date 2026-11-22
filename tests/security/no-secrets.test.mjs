import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Guards the repository rule "no secrets in source, docs or client code".
// It scans every text file in the working tree (not only tracked ones), so a
// key pasted into a new file is caught before it is ever committed.

const root = fileURLToPath(new URL("../..", import.meta.url));
const self = fileURLToPath(import.meta.url);
const skipDirs = new Set(["node_modules", ".next", ".git", "out", "fonts"]);
const textFile = /\.(ts|tsx|js|mjs|cjs|json|md|css|sql|yml|yaml|txt|example)$/i;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) yield* walk(full);
    else if (textFile.test(name) && stat.size < 1_000_000 && full !== self) yield full;
  }
}

const valuePatterns = [
  ["JWT-shaped token", /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/],
  ["Supabase secret key", /sb_secret_[A-Za-z0-9_-]{8,}/],
  ["API key in the sk- format", /\bsk-[A-Za-z0-9_-]{24,}/],
  ["AWS access key id", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{30,}/],
  ["Slack token", /\bxox[bap]-[0-9A-Za-z-]{10,}/],
  ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["service-role key assignment", /SERVICE_ROLE_KEY\s*[=:]\s*["']?[A-Za-z0-9._-]{12,}/],
];

// Code-only patterns: documentation may mention these names as warnings.
const codePatterns = [
  ["secret exposed through a NEXT_PUBLIC_ name", /NEXT_PUBLIC_[A-Z0-9_]*(SECRET|SERVICE_ROLE|PRIVATE)[A-Z0-9_]*/],
  ["service-role key read from the environment", /process\.env\.[A-Z0-9_]*SERVICE_ROLE/],
];

test("no secret-shaped values anywhere in the working tree", () => {
  const found = [];
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    const isDoc = file.endsWith(".md");
    for (const [label, pattern] of [...valuePatterns, ...(isDoc ? [] : codePatterns)]) {
      if (pattern.test(text)) found.push(label + " in " + relative(root, file));
    }
  }
  assert.deepEqual(found, []);
});

test(".env.example contains placeholders only", () => {
  const lines = readFileSync(join(root, ".env.example"), "utf8")
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"));
  assert.ok(lines.length > 0);
  for (const line of lines) {
    const value = line.slice(line.indexOf("=") + 1).trim();
    assert.match(value, /^(http:\/\/localhost:\d+|https:\/\/your-|sb_publishable_your-)/, line.split("=")[0] + " must stay a placeholder");
  }
});
