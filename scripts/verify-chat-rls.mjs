// Проверка RLS чата на настоящем Postgres (WASM), без Supabase и без сети.
// Запуск: npm i --no-save @electric-sql/pglite && node scripts/verify-chat-rls.mjs
// Скрипт сам создаёт заглушки auth.users / auth.uid() / auth.jwt() и роли Supabase,
// применяет supabase/schema.sql и проверяет сценарии от имени разных пользователей.
import { readFileSync } from "node:fs";

let PGlite;
try {
  ({ PGlite } = await import("@electric-sql/pglite"));
} catch {
  console.error("Нужен пакет: npm i --no-save @electric-sql/pglite");
  process.exit(2);
}

const db = new PGlite();
const id = (n) => `00000000-0000-4000-8000-0000000000${n}`;
const U = { A: id("0a"), B: id("0b"), C: id("0c"), M: id("0d"), AD: id("0e"), X: id("0f") };
const claims = {
  A: { sub: U.A, role: "authenticated", app_metadata: {} },
  B: { sub: U.B, role: "authenticated", app_metadata: {} },
  C: { sub: U.C, role: "authenticated", app_metadata: {} },
  M: { sub: U.M, role: "authenticated", app_metadata: { role: "mentor" } },
  AD: { sub: U.AD, role: "authenticated", app_metadata: { role: "admin" } },
  // роль только в user_metadata, которым управляет сам пользователь: прав давать не должна
  X: { sub: U.X, role: "authenticated", app_metadata: {}, user_metadata: { role: "admin" } },
};

await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}'::jsonb);
  create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(auth.jwt() ->> 'sub', '')::uuid $$;
  grant usage on schema public, auth to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
`);
await db.exec(readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8"));
for (const [name, uid] of Object.entries(U)) await db.query("insert into auth.users (id, email) values ($1, $2)", [uid, `${name}@example.test`]);
for (const uid of [U.A, U.B, U.X]) await db.query("insert into public.enrollments (student_id, status) values ($1, 'active')", [uid]);
await db.query("insert into public.enrollments (student_id, status) values ($1, 'cancelled')", [U.C]);

async function as(who, sql, params = []) {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify(claims[who])]);
  await db.exec("set role authenticated");
  try {
    const r = await db.query(sql, params);
    return { rows: r.rows, count: r.affectedRows ?? r.rows.length };
  } catch (e) {
    return { error: e.message, code: e.code };
  } finally {
    await db.exec("reset role");
  }
}
const root = async (sql, params = []) => (await db.query(sql, params)).rows;

let failed = 0;
const check = (name, ok, extra = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : "  " + extra}`);
};
const denied = (name, r) => check(name, Boolean(r.error), JSON.stringify(r));
const allowed = (name, r) => check(name, !r.error, JSON.stringify(r));

const openThread = (who, student, openedBy = claims[who].sub) =>
  as(who, "insert into public.chat_threads (student_id, opened_by) values ($1, $2) returning id", [student, openedBy]);
const send = (who, thread, kind, body = "Привет") =>
  as(who, "insert into public.chat_messages (thread_id, author_id, author_kind, body) values ($1, $2, $3, $4) returning id", [thread, claims[who].sub, kind, body]);

// --- ветки ---
denied("ученик не может создать ветку себе", await openThread("A", U.A));
denied("наставник не может создать ветку", await openThread("M", U.A));
denied("роль только в user_metadata не открывает ветку", await openThread("X", U.A));
denied("админ не открывает ветку без активной записи", await openThread("AD", U.C));
denied("админ не подставляет чужой opened_by", await openThread("AD", U.A, U.M));
denied("админ не может задать last_message_at (нет права на колонку)", await as("AD", "insert into public.chat_threads (student_id, opened_by, last_message_at) values ($1, $2, now())", [U.A, U.AD]));
const ta = await openThread("AD", U.A);
allowed("админ открывает ветку ученику с активной записью", ta);
const threadA = ta.rows?.[0]?.id;
denied("вторая ветка тому же ученику (unique)", await openThread("AD", U.A));
const tb = await openThread("AD", U.B);
const threadB = tb.rows?.[0]?.id;

// --- чтение веток ---
check("ученик A видит только свою ветку", (await as("A", "select student_id from public.chat_threads")).rows?.every((r) => r.student_id === U.A) && (await as("A", "select 1 from public.chat_threads")).rows.length === 1);
check("наставник видит все ветки", (await as("M", "select 1 from public.chat_threads")).rows.length === 2);
check("user_metadata.role не даёт читать чужие ветки", (await as("X", "select 1 from public.chat_threads")).rows.length === 0);
check("ученик не может сменить статус ветки (0 строк)", (await as("A", "update public.chat_threads set status = 'closed' where id = $1", [threadA])).count === 0 && (await root("select status from public.chat_threads where id = $1", [threadA]))[0].status === "open");
denied("ученик не может менять student_id ветки", await as("A", "update public.chat_threads set student_id = $1 where id = $2", [U.B, threadA]));
denied("ученик не может удалить ветку", await as("A", "delete from public.chat_threads where id = $1", [threadA]));

// --- сообщения ---
allowed("ученик пишет в свою ветку", await send("A", threadA, "student", "Вопрос по проекту"));
const afterA = (await root("select last_author_kind, last_message_at is not null as has_time from public.chat_threads where id = $1", [threadA]))[0];
check("триггер обновил last_author_kind и время", afterA.last_author_kind === "student" && afterA.has_time);
check("ученик B не видит сообщения ветки A", (await as("B", "select 1 from public.chat_messages where thread_id = $1", [threadA])).rows.length === 0);
denied("ученик B не может писать в ветку A", await send("B", threadA, "student"));
denied("ученик не может писать как staff", await send("A", threadA, "staff"));
denied("ученик не подставляет чужой author_id", await as("A", "insert into public.chat_messages (thread_id, author_id, author_kind, body) values ($1, $2, 'student', 'x')", [threadA, U.B]));
denied("ученик не задаёт created_at (нет права на колонку)", await as("A", "insert into public.chat_messages (thread_id, author_id, author_kind, body, created_at) values ($1, $2, 'student', 'x', now() - interval '1 day')", [threadA, U.A]));
denied("наставник не пишет от имени ученика", await send("M", threadA, "student"));
allowed("наставник отвечает как staff", await send("M", threadA, "staff", "Давайте разберём"));
check("после ответа last_author_kind = staff", (await root("select last_author_kind from public.chat_threads where id = $1", [threadA]))[0].last_author_kind === "staff");
denied("user_metadata.role не даёт отвечать", await send("X", threadA, "staff"));
check("ученик читает обе реплики", (await as("A", "select 1 from public.chat_messages where thread_id = $1", [threadA])).rows.length === 2);
denied("сообщение нельзя изменить", await as("A", "update public.chat_messages set body = 'правка' where thread_id = $1", [threadA]));
denied("сообщение нельзя удалить", await as("A", "delete from public.chat_messages where thread_id = $1", [threadA]));
denied("наставник не может удалить сообщение", await as("M", "delete from public.chat_messages where thread_id = $1", [threadA]));
denied("пустое сообщение запрещено", await send("A", threadA, "student", "   "));
denied("4001 символ запрещён", await send("A", threadA, "student", "я".repeat(4001)));
allowed("4000 символов разрешено", await send("A", threadA, "student", "я".repeat(4000)));

// --- закрытие и запись ---
check("наставник не может закрыть ветку (0 строк)", (await as("M", "update public.chat_threads set status = 'closed' where id = $1", [threadA])).count === 0);
allowed("админ закрывает ветку", await as("AD", "update public.chat_threads set status = 'closed' where id = $1 returning id", [threadA]));
denied("в закрытой ветке ученик не пишет", await send("A", threadA, "student"));
denied("в закрытой ветке наставник не пишет", await send("M", threadA, "staff"));
await as("AD", "update public.chat_threads set status = 'open' where id = $1", [threadA]);
await root("update public.enrollments set status = 'cancelled' where student_id = $1", [U.A]);
denied("без активной записи ученик не пишет", await send("A", threadA, "student"));
await root("update public.enrollments set status = 'active' where student_id = $1", [U.A]);

// --- частота ---
let sent = 0;
for (let i = 0; i < 20; i++) {
  const r = await send("B", threadB, "student", `m${i}`);
  if (r.error) break;
  sent++;
}
check("ученик может отправить не больше 12 сообщений в минуту", sent === 12, `отправлено ${sent}`);
let staffSent = 0;
for (let i = 0; i < 40; i++) {
  const r = await send("M", threadB, "staff", `s${i}`);
  if (r.error) break;
  staffSent++;
}
check("команда: не больше 30 сообщений в минуту (одно уже отправлено выше)", staffSent === 29, `отправлено ${staffSent}`);

// --- отметки «прочитано» ---
const mark = (who, thread, user) => as(who, "insert into public.chat_reads (thread_id, user_id) values ($1, $2) on conflict (thread_id, user_id) do update set last_read_at = now() returning thread_id", [thread, user]);
allowed("ученик отмечает свою ветку прочитанной", await mark("A", threadA, U.A));
allowed("повторная отметка обновляется (upsert)", await mark("A", threadA, U.A));
denied("нельзя поставить отметку за другого", await mark("A", threadA, U.B));
denied("нельзя отметить чужую ветку", await mark("B", threadA, U.B));
allowed("наставник отмечает ветку ученика", await mark("M", threadA, U.M));
check("отметки видны только владельцу", (await as("A", "select user_id from public.chat_reads")).rows.every((r) => r.user_id === U.A));

// --- список ожидания (политика из соседней миграции) ---
const join = (who, user, status = "pending", slug = "demo-product") =>
  as(who, "insert into public.enrollments (student_id, program_slug, status) values ($1, $2, $3) returning id", [user, slug, status]);
allowed("ученик встаёт в список ожидания (pending)", await join("C", U.C));
denied("ученик не создаёт active-запись себе", await join("C", U.C, "active", "other-product"));
denied("нельзя записать за другого", await join("C", U.B, "pending", "third-product"));
let joined = 1;
for (let i = 0; i < 45; i++) {
  const r = await join("C", U.C, "pending", `product-${i}`);
  if (r.error) break;
  joined++;
}
check("всего не больше 40 записей на ученика (одна уже была)", joined === 39, `новых записей ${joined}`);

// --- прочее ---
denied("триггерную функцию нельзя вызвать клиентом", await as("A", "select public.touch_chat_thread()"));
await root("delete from public.chat_threads where id = $1", [threadA]);
check("удаление ветки каскадно удаляет сообщения", (await root("select count(*)::int as n from public.chat_messages where thread_id = $1", [threadA]))[0].n === 0);

console.log(failed ? `\nПровалено: ${failed}` : "\nВсе проверки пройдены");
process.exit(failed ? 1 : 0);
