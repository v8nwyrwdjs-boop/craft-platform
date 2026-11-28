import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Вход", robots: { index: false, follow: false } };

const messages: Record<string, string> = {
  setup: "Вход пока не подключён на сервере.",
  validation: "Введите email и пароль.",
  credentials: "Не удалось войти. Проверьте email и пароль или подтвердите почту.",
  callback: "Ссылка подтверждения недействительна или устарела. Запросите новую.",
  "reset-session": "Ссылка восстановления истекла. Запросите письмо ещё раз.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;
  return (
    <AuthShell
      heading={<h1 id="auth-title" className="f-display f-h1 f-h1--page">Вход в кабинет</h1>}
      lead="Войдите, чтобы продолжить работу над своим проектом."
      notice={params.error ? { tone: "bad", text: messages[params.error] ?? "Не удалось выполнить вход." } : null}
      footer={
        <>
          <p><Link className="f-link" href="/forgot-password">Забыли пароль?</Link></p>
          <p>Ещё нет аккаунта? <Link className="f-link" href="/register">Зарегистрироваться</Link></p>
        </>
      }
    >
      <form action={signIn}>
        <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
        <div className="f-field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="f-field">
          <label htmlFor="login-password">Пароль</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button className="f-btn" type="submit">Войти</button>
      </form>
    </AuthShell>
  );
}
