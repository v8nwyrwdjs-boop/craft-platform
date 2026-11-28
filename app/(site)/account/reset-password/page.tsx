import type { Metadata } from "next";
import Link from "next/link";
import { updatePassword } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Новый пароль", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  const notice = params.error
    ? ({ tone: "bad", text: "Не удалось обновить пароль. Проверьте ссылку и попробуйте ещё раз." } as const)
    : params.success
      ? ({ tone: "good", text: "Пароль обновлён. Теперь можно войти в аккаунт." } as const)
      : null;
  return (
    <AuthShell
      heading={<h1 id="auth-title" className="f-display f-h1 f-h1--page">Новый пароль</h1>}
      lead="Задайте новый пароль для аккаунта CRAFT."
      notice={notice}
      footer={<p><Link className="f-link" href="/login">Вернуться ко входу</Link></p>}
    >
      <form action={updatePassword}>
        <div className="f-field">
          <label htmlFor="reset-password">Новый пароль</label>
          <input id="reset-password" name="password" type="password" autoComplete="new-password" minLength={8} aria-describedby="reset-password-hint" required />
          <p id="reset-password-hint" className="f-auth__hint">Не менее 8 символов.</p>
        </div>
        <button className="f-btn" type="submit">Сохранить пароль</button>
      </form>
    </AuthShell>
  );
}
