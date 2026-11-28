import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Регистрация", robots: { index: false, follow: false } };

const messages: Record<string, string> = {
  setup: "Регистрация пока не подключена на сервере.",
  validation: "Проверьте имя, email и пароль (не менее 8 символов).",
  signup: "Не удалось создать аккаунт. Возможно, этот email уже зарегистрирован.",
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  const notice = params.error
    ? ({ tone: "bad", text: messages[params.error] ?? "Что-то пошло не так. Попробуйте ещё раз." } as const)
    : params.success === "confirm"
      ? ({ tone: "good", text: "Аккаунт почти готов. Проверьте почту и перейдите по ссылке подтверждения." } as const)
      : null;
  return (
    <AuthShell
      heading={<h1 id="auth-title" className="f-display f-h1 f-h1--page">Создать аккаунт</h1>}
      lead="В аккаунте хранятся ваш проект и прогресс. Регистрация бесплатна и не означает покупку обучения."
      notice={notice}
      footer={
        <>
          <p className="f-small f-muted">Условия использования и политика конфиденциальности будут опубликованы до открытия регистрации для пользователей.</p>
          <p>Уже есть аккаунт? <Link className="f-link" href="/login">Войти</Link></p>
        </>
      }
    >
      <form action={signUp}>
        <div className="f-field">
          <label htmlFor="register-name">Как к вам обращаться</label>
          <input id="register-name" name="name" type="text" autoComplete="name" minLength={2} required />
        </div>
        <div className="f-field">
          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="f-field">
          <label htmlFor="register-password">Пароль</label>
          <input id="register-password" name="password" type="password" autoComplete="new-password" minLength={8} aria-describedby="register-password-hint" required />
          <p id="register-password-hint" className="f-auth__hint">Не менее 8 символов.</p>
        </div>
        <button className="f-btn" type="submit">Создать аккаунт</button>
      </form>
    </AuthShell>
  );
}
