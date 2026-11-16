import Link from "next/link";
import { updatePassword } from "@/app/actions/auth";

export default function ResetPasswordPage({ searchParams }: { searchParams: { error?: string; success?: string } }) {
  return (
    <main className="auth-shell">
      <header className="auth-top"><Link className="brand" href="/">CRAFT<span>®</span></Link><Link href="/">На главную ↗</Link></header>
      <section className="auth-card">
        <p className="eyebrow"><i /> CRAFT / БЕЗОПАСНОСТЬ</p>
        <h1>Новый<br /><em>пароль.</em></h1>
        <p className="auth-intro">Задай новый пароль для своего аккаунта CRAFT.</p>
        {searchParams.error && <p className="auth-message error">Не удалось обновить пароль. Проверь ссылку и попробуй ещё раз.</p>}
        {searchParams.success && <p className="auth-message success">Пароль обновлён. Теперь можно войти в аккаунт.</p>}
        <form action={updatePassword} className="auth-form">
          <label>Новый пароль<input name="password" type="password" autoComplete="new-password" minLength={8} placeholder="Не менее 8 символов" required /></label>
          <button className="button button-dark auth-submit" type="submit">Сохранить пароль <span>↗</span></button>
        </form>
        <p className="auth-switch"><Link href="/login">Вернуться ко входу</Link></p>
      </section>
    </main>
  );
}
