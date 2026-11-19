import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-shell">
      <header className="auth-top"><Link className="brand" href="/">CRAFT<span>®</span></Link><Link href="/">На главную ↗</Link></header>
      <section className="auth-card">
        <p className="eyebrow"><i /> CRAFT / ВОССТАНОВЛЕНИЕ ДОСТУПА</p>
        <h1>Вернёмся<br /><em>к проекту.</em></h1>
        <p className="auth-intro">Укажи email аккаунта. Если он зарегистрирован, отправим ссылку для создания нового пароля.</p>
        {params.error && <p className="auth-message error">Не удалось отправить письмо. Попробуй позже.</p>}
        {params.success && <p className="auth-message success">Если аккаунт с таким email существует, письмо со ссылкой уже отправлено.</p>}
        <form action={requestPasswordReset} className="auth-form">
          <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <button className="button button-dark auth-submit" type="submit">Отправить ссылку <span>↗</span></button>
        </form>
        <p className="auth-switch"><Link href="/login">Вернуться ко входу</Link></p>
      </section>
    </main>
  );
}
