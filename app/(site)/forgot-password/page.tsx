import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Восстановление доступа", robots: { index: false, follow: false } };

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  const notice = params.error
    ? ({ tone: "bad", text: "Не удалось отправить письмо. Попробуйте позже." } as const)
    : params.success
      ? ({ tone: "good", text: "Если аккаунт с таким email существует, письмо со ссылкой уже отправлено." } as const)
      : null;
  return (
    <AuthShell
      heading={<h1 id="auth-title" className="f-display f-h1 f-h1--page">Восстановление доступа</h1>}
      lead="Укажите email аккаунта. Если он зарегистрирован, мы отправим ссылку для создания нового пароля."
      notice={notice}
      footer={<p><Link className="f-link" href="/login">Вернуться ко входу</Link></p>}
    >
      <form action={requestPasswordReset}>
        <div className="f-field">
          <label htmlFor="forgot-email">Email</label>
          <input id="forgot-email" name="email" type="email" autoComplete="email" required />
        </div>
        <button className="f-btn" type="submit">Отправить ссылку</button>
      </form>
    </AuthShell>
  );
}
