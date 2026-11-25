// Состояния и тексты листа ожидания. Файл без импортов: его читают форма, действие и тесты.

export type WaitlistStatus = "idle" | "ok" | "already" | "error" | "setup";
export type WaitlistState = { status: WaitlistStatus };
/** access: продукт открыт, доступ выдаёт команда вручную; waitlist: продукт ещё готовится. */
export type WaitlistIntent = "access" | "waitlist";

export const waitlistLabel: Record<WaitlistIntent, string> = {
  access: "Записаться в список",
  waitlist: "Встать в список ожидания",
};

const messages: Record<WaitlistIntent, Record<Exclude<WaitlistStatus, "idle">, string>> = {
  access: {
    ok: "Запись принята. Доступ открывает команда CRAFT вручную, сроков пока нет.",
    already: "Вы уже записаны на этот продукт.",
    setup: "Запись пока не включена на сервере. Попробуйте позже.",
    error: "Не получилось записать. Попробуйте ещё раз.",
  },
  waitlist: {
    ok: "Вы в списке ожидания. Продукт пока не открыт, сроков нет.",
    already: "Вы уже в списке ожидания.",
    setup: "Список ожидания пока не включён на сервере. Попробуйте позже.",
    error: "Не получилось записать. Попробуйте ещё раз.",
  },
};

export function waitlistMessage(intent: WaitlistIntent, status: WaitlistStatus): string {
  return status === "idle" ? "" : messages[intent][status];
}
