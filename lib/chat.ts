// Правила чата «ученик ↔ команда». Файл без импортов: его читают действия, компоненты и тесты.

export const CHAT_BODY_MAX = 4000;
export const CHAT_POLL_MS = 20_000;
export const CHAT_PAGE_SIZE = 200;

/** student: автор — ученик ветки; staff: наставник или администратор. */
export type ChatKind = "student" | "staff";

export type ChatErrorCode = "empty" | "too_long" | "invalid" | "missing" | "closed" | "denied" | "setup";
export type SendState = { sent: number; error: "" | ChatErrorCode };

export const chatErrorText: Record<ChatErrorCode, string> = {
  empty: "Напишите сообщение.",
  too_long: `Сообщение длиннее ${CHAT_BODY_MAX} символов. Сократите его или разбейте на два.`,
  invalid: "Не удалось прочитать сообщение. Обновите страницу и попробуйте ещё раз.",
  missing: "Чат не найден или недоступен.",
  closed: "Чат закрыт, писать в него пока нельзя.",
  denied: "Не отправилось. Возможно, вы пишете слишком часто: подождите минуту и повторите.",
  setup: "Чат пока не включён на сервере. Попробуйте позже.",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: unknown): value is string => typeof value === "string" && UUID.test(value);

/** Роль читается только из доверенного app_metadata (его меняет владелец проекта, не пользователь). */
export const isStaffRole = (role: unknown): boolean => role === "admin" || role === "mentor";

/** Кем пользователь является в ветке: владелец ветки — ученик, иначе команда, иначе никем. */
export function chatKindFor(role: unknown, userId: string, studentId: string): ChatKind | null {
  if (userId === studentId) return "student";
  return isStaffRole(role) ? "staff" : null;
}

// Управляющие символы, нулевой ширины и переключатели направления текста (подмена порядка символов).
// ZWJ/ZWNJ (U+200C/D) остаются: без них ломаются составные эмодзи.
const HIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F​‎‏‪-‮⁠-⁤⁦-⁩﻿]/g;

export type ChatBodyResult = { ok: true; body: string } | { ok: false; error: "empty" | "too_long" | "invalid" };

/** Текст сообщения: только обычный текст, переводы строк приведены к \n, не больше двух пустых строк подряд. */
export function normalizeChatBody(raw: unknown): ChatBodyResult {
  if (typeof raw !== "string") return { ok: false, error: "invalid" };
  const body = raw
    .replace(/\r\n?/g, "\n")
    .replace(HIDDEN, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!body) return { ok: false, error: "empty" };
  if (body.length > CHAT_BODY_MAX) return { ok: false, error: "too_long" };
  return { ok: true, body };
}

type ThreadMark = { last_message_at: string | null; last_author_kind: ChatKind | null };

/** Последним написал ученик: ветка ждёт ответа команды. */
export const waitingForTeam = (thread: ThreadMark): boolean => thread.last_author_kind === "student";

/** Есть сообщение другой стороны, которое смотрящий ещё не открывал. */
export function isUnread(thread: ThreadMark, viewer: ChatKind, lastReadAt: string | null): boolean {
  if (!thread.last_message_at || thread.last_author_kind === null || thread.last_author_kind === viewer) return false;
  if (!lastReadAt) return true;
  return Date.parse(thread.last_message_at) > Date.parse(lastReadAt);
}

/** Сначала ветки, где последним написал ученик, внутри групп — по свежести. */
export function sortThreads<T extends ThreadMark & { created_at: string }>(threads: T[]): T[] {
  const stamp = (t: T) => Date.parse(t.last_message_at ?? t.created_at);
  return [...threads].sort((a, b) => Number(waitingForTeam(b)) - Number(waitingForTeam(a)) || stamp(b) - stamp(a));
}

const sameDay = (a: Date, b: Date, timeZone?: string) => {
  const f = new Intl.DateTimeFormat("ru-RU", { timeZone, year: "numeric", month: "numeric", day: "numeric" });
  return f.format(a) === f.format(b);
};

/** «14:05» для сегодняшних сообщений, «27 нояб., 14:05» для остальных, с годом для прошлых лет. */
export function chatStamp(iso: string, now: number = Date.now(), timeZone?: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const time = new Intl.DateTimeFormat("ru-RU", { timeZone, hour: "2-digit", minute: "2-digit" }).format(date);
  const today = new Date(now);
  if (sameDay(date, today, timeZone)) return time;
  const year = new Intl.DateTimeFormat("ru-RU", { timeZone, year: "numeric" });
  const day = new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    day: "numeric",
    month: "short",
    ...(year.format(date) === year.format(today) ? {} : { year: "numeric" }),
  }).format(date);
  return `${day}, ${time}`;
}
