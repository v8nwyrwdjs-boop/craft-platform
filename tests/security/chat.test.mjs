import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CHAT_BODY_MAX, chatKindFor, chatStamp, isStaffRole, isUnread, isUuid, normalizeChatBody, sortThreads, waitingForTeam } from "../../lib/chat.ts";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const migration = read("supabase/migrations/202611280001_mentor_chat.sql");
const schema = read("supabase/schema.sql");
const chatFiles = [
  "app/actions/chat.ts",
  "lib/chat.ts",
  "lib/chat-data.ts",
  "components/chat-composer.tsx",
  "components/chat-live.tsx",
  "components/chat-log.tsx",
  "components/chat-notice.tsx",
  "components/chat-thread.tsx",
  "components/chat-time.tsx",
  "app/(site)/messages/page.tsx",
  "app/(site)/messages/[thread]/page.tsx",
];

test("message text is plain, bounded and stripped of hidden control characters", () => {
  assert.deepEqual(normalizeChatBody(42), { ok: false, error: "invalid" });
  assert.deepEqual(normalizeChatBody(" \n\t "), { ok: false, error: "empty" });
  assert.deepEqual(normalizeChatBody("я".repeat(CHAT_BODY_MAX)), { ok: true, body: "я".repeat(CHAT_BODY_MAX) });
  assert.deepEqual(normalizeChatBody("я".repeat(CHAT_BODY_MAX + 1)), { ok: false, error: "too_long" });
  assert.equal(normalizeChatBody("a\r\nb\rc").body, "a\nb\nc");
  assert.equal(normalizeChatBody("a‮b​c\u0000d﻿").body, "abcd");
  assert.equal(normalizeChatBody("a\n\n\n\n\nb").body, "a\n\nb");
  assert.equal(normalizeChatBody("👨‍💻 готово").body, "👨‍💻 готово");
  assert.equal(normalizeChatBody("<script>alert(1)</script>").body, "<script>alert(1)</script>", "markup stays literal text; React escapes it on render");
});

test("roles and thread ownership decide who may write", () => {
  const student = "11111111-1111-4111-8111-111111111111";
  const other = "22222222-2222-4222-8222-222222222222";
  assert.ok(isUuid(student));
  assert.ok(!isUuid("not-a-uuid") && !isUuid(null) && !isUuid(`${student}x`));
  assert.ok(isStaffRole("admin") && isStaffRole("mentor"));
  assert.ok(!isStaffRole("student") && !isStaffRole(undefined) && !isStaffRole("ADMIN"));
  assert.equal(chatKindFor(undefined, student, student), "student");
  assert.equal(chatKindFor("admin", student, student), "student", "an admin inside their own thread writes as a student");
  assert.equal(chatKindFor("mentor", other, student), "staff");
  assert.equal(chatKindFor(undefined, other, student), null);
});

test("unread, waiting and ordering follow the last author", () => {
  const t = (last_author_kind, last_message_at, created_at = "2026-11-01T00:00:00Z") => ({ last_author_kind, last_message_at, created_at });
  assert.ok(waitingForTeam(t("student", "2026-11-02T00:00:00Z")));
  assert.ok(!waitingForTeam(t("staff", "2026-11-02T00:00:00Z")) && !waitingForTeam(t(null, null)));
  assert.ok(isUnread(t("student", "2026-11-02T00:00:00Z"), "staff", null));
  assert.ok(isUnread(t("student", "2026-11-02T00:00:00Z"), "staff", "2026-11-01T00:00:00Z"));
  assert.ok(!isUnread(t("student", "2026-11-02T00:00:00Z"), "staff", "2026-11-03T00:00:00Z"));
  assert.ok(!isUnread(t("staff", "2026-11-02T00:00:00Z"), "staff", null), "own message is never unread");
  assert.ok(!isUnread(t(null, null), "student", null));
  const ordered = sortThreads([
    { id: "answered", ...t("staff", "2026-11-09T00:00:00Z") },
    { id: "old-wait", ...t("student", "2026-11-03T00:00:00Z") },
    { id: "new-wait", ...t("student", "2026-11-05T00:00:00Z") },
    { id: "empty", ...t(null, null, "2026-11-10T00:00:00Z") },
  ]).map((x) => x.id);
  assert.deepEqual(ordered, ["new-wait", "old-wait", "empty", "answered"]);
});

test("timestamps are short for today and carry the date otherwise", () => {
  const now = Date.parse("2026-11-27T20:00:00Z");
  assert.equal(chatStamp("2026-11-27T14:05:00Z", now, "UTC"), "14:05");
  assert.match(chatStamp("2026-11-20T14:05:00Z", now, "UTC"), /^20 нояб\.?, 14:05$/);
  assert.match(chatStamp("2025-11-20T14:05:00Z", now, "UTC"), /2025/);
  assert.equal(chatStamp("not a date", now, "UTC"), "");
});

const policyBlocks = (sql) =>
  [...sql.matchAll(/create policy "([^"]+)" on public\.(\w+)\s+for (select|insert|update|delete|all)\b([\s\S]*?);\n/gi)].map((m) => ({ name: m[1], table: m[2], command: m[3].toLowerCase(), text: m[4] }));

for (const [label, source] of [["migration", migration], ["schema.sql", schema]]) {
  test(`chat tables are locked down by RLS (${label})`, () => {
    for (const table of ["chat_threads", "chat_messages", "chat_reads"]) {
      assert.match(source, new RegExp(`alter table public\\.${table} enable row level security`, "i"), table);
    }
    const policies = policyBlocks(source).filter((p) => p.table.startsWith("chat_"));
    const names = (table, command) => policies.filter((p) => p.table === table && p.command === command).map((p) => p.name).sort();

    assert.deepEqual(names("chat_threads", "insert"), ["Admins can open chat threads"], "only an admin opens a thread");
    assert.deepEqual(names("chat_threads", "update"), ["Admins can close and reopen chat threads"]);
    assert.deepEqual(names("chat_messages", "insert"), ["Staff can reply in open chat threads", "Students can write in their open chat thread"]);
    assert.deepEqual(names("chat_messages", "update"), [], "messages are immutable");
    assert.deepEqual(names("chat_messages", "delete"), []);
    assert.deepEqual(policies.filter((p) => p.command === "all"), []);

    const open = policies.find((p) => p.name === "Admins can open chat threads").text;
    assert.match(open, /\(auth\.jwt\(\) -> 'app_metadata' ->> 'role'\) = 'admin'/);
    assert.match(open, /opened_by = auth\.uid\(\)/);
    assert.match(open, /e\.status = 'active'/);

    const student = policies.find((p) => p.name === "Students can write in their open chat thread").text;
    assert.match(student, /author_kind = 'student'/);
    assert.match(student, /author_id = auth\.uid\(\)/);
    assert.match(student, /t\.student_id = auth\.uid\(\) and t\.status = 'open'/);
    assert.match(student, /e\.status = 'active'/);
    assert.match(student, /my_chat_message_count\(interval '1 minute'\) < 12/);
    assert.match(student, /my_chat_message_count\(interval '1 day'\) < 400/);

    const staff = policies.find((p) => p.name === "Staff can reply in open chat threads").text;
    assert.match(staff, /author_kind = 'staff'/);
    assert.match(staff, /author_id = auth\.uid\(\)/);
    assert.match(staff, /\(auth\.jwt\(\) -> 'app_metadata' ->> 'role'\) in \('admin', 'mentor'\)/);
    assert.match(staff, /t\.student_id <> auth\.uid\(\) and t\.status = 'open'/);
    assert.match(staff, /my_chat_message_count\(interval '1 minute'\) < 30/);

    const readable = policies.filter((p) => p.command === "select" && p.table !== "chat_reads").map((p) => p.name).sort();
    assert.deepEqual(readable, ["Staff can read all chat messages", "Staff can read all chat threads", "Students can read their own chat messages", "Students can read their own chat thread"]);
    assert.doesNotMatch(source, /user_metadata/);
  });

  test(`chat writes are limited to the columns the app sets (${label})`, () => {
    assert.match(source, /revoke insert, update, delete on public\.chat_threads from authenticated;\s*grant insert \(student_id, opened_by\) on public\.chat_threads to authenticated;\s*grant update \(status\) on public\.chat_threads to authenticated;/);
    assert.match(source, /revoke insert, update, delete on public\.chat_messages from authenticated;\s*grant insert \(thread_id, author_id, author_kind, body\) on public\.chat_messages to authenticated;/);
    assert.match(source, /revoke insert, update, delete on public\.chat_reads from authenticated;\s*grant insert \(thread_id, user_id, last_read_at\) on public\.chat_reads to authenticated;\s*grant update \(last_read_at\) on public\.chat_reads to authenticated;/);
    assert.match(source, new RegExp(`char_length\\(btrim\\(body\\)\\) between 1 and ${CHAT_BODY_MAX}`));
  });

  test(`no chat policy selects from its own table, Postgres reports infinite recursion (${label})`, () => {
    for (const p of policyBlocks(source).filter((x) => x.table.startsWith("chat_"))) {
      assert.doesNotMatch(p.text, new RegExp(`from public\\.${p.table}\\b`), `${p.name} reads ${p.table} inside its own policy`);
    }
  });

  test(`security definer helpers pin search_path and cannot be called for another user (${label})`, () => {
    for (const fn of ["touch_chat_thread", "my_chat_message_count"]) {
      const match = source.match(new RegExp(`create or replace function public\\.${fn}\\([\\s\\S]*?\\$\\$;`, "i"));
      assert.ok(match, `${fn} is missing`);
      assert.match(match[0], /security definer set search_path = ''/i);
    }
    const counter = source.match(/create or replace function public\.my_chat_message_count[\s\S]*?\$\$;/i)[0];
    assert.match(counter, /\(select auth\.uid\(\)\)/);
    assert.doesNotMatch(counter, /p_user|user_id uuid/i);
    assert.match(source, /revoke all on function public\.touch_chat_thread\(\) from public, anon, authenticated;/);
    assert.match(source, /revoke all on function public\.my_chat_message_count\(interval\) from public, anon;/);
  });
}

test("schema.sql carries the migration verbatim", () => {
  assert.ok(schema.includes(migration), "schema.sql must contain supabase/migrations/202611280001_mentor_chat.sql unchanged");
});

test("server actions take identity and role only from the session", () => {
  const actions = read("app/actions/chat.ts");
  assert.match(actions, /^"use server";/);
  assert.match(actions, /supabase\.auth\.getUser\(\)/);
  assert.match(actions, /user\.app_metadata\?\.role/);
  assert.match(actions, /author_id: user\.id/);
  assert.doesNotMatch(actions, /author_id: (?:String\()?formData/);
  assert.doesNotMatch(actions, /user_metadata|service_role|SERVICE_ROLE|createAdminClient/);
  assert.match(actions, /normalizeChatBody\(/);
  assert.match(actions, /chatKindFor\(/);
  assert.equal((actions.match(/role !== "admin"\) redirect/g) ?? []).length, 2, "opening and closing threads are admin-only");
});

test("chat is rendered as plain text, refreshed by polling and never leaks to crawlers", () => {
  for (const file of chatFiles) {
    const source = read(file);
    assert.doesNotMatch(source, /dangerouslySetInnerHTML|innerHTML|\.channel\(|WebSocket|realtime/i, file);
    assert.doesNotMatch(source, /https?:\/\//, `${file} must not reference external hosts`);
  }
  const live = read("components/chat-live.tsx");
  assert.match(live, /document\.hidden/);
  assert.match(live, /navigator\.onLine/);
  assert.match(live, /clearInterval/);
  assert.match(live, /removeEventListener\("visibilitychange"/);
  assert.match(live, /CHAT_POLL_MS/);
  const composer = read("components/chat-composer.tsx");
  assert.match(composer, /maxLength=\{CHAT_BODY_MAX\}/);
  assert.match(composer, /htmlFor="chat-body"/);
  assert.match(composer, /role="alert"/);
  for (const page of ["app/(site)/messages/page.tsx", "app/(site)/messages/[thread]/page.tsx"]) {
    const source = read(page);
    assert.match(source, /robots: \{ index: false, follow: false \}/, page);
    assert.match(source, /redirect\("\/login\?next=|redirect\(`\/login\?next=/, page);
  }
  assert.match(read("app/(site)/messages/[thread]/page.tsx"), /isStaffRole\(role\)\) redirect\("\/messages"\)/);
  const css = read("app/v2.css");
  assert.match(css, /\.f-chat__bubble \{[^}]*white-space: pre-wrap[^}]*overflow-wrap: anywhere/);
});

test("the RLS scenario runner exists for the owner to re-run before applying the migration", () => {
  const runner = read("scripts/verify-chat-rls.mjs");
  assert.match(runner, /@electric-sql\/pglite/);
  assert.match(runner, /supabase\/schema\.sql|\.\.\/supabase\/schema\.sql/);
});
