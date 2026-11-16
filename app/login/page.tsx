import Link from "next/link";
import { signIn } from "@/app/actions/auth";

const messages: Record<string, string> = {
  setup: "Вход пока не подключён: требуется настроить Supabase.",
  validation: "Введи email и пароль.",
  credentials: "Не удалось войти. Проверь email и пароль или подтверди почту.",
  callback: "Ссылка подтверждения недействительна или устарела. Запроси новую.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-shell">
      <header className="auth-top"><Link className="brand" href="/">CRAFT<span>®</span></Link><Link href="/">На главную ↗</Link></header>
      <section className="auth-card">
        <p className="eyebrow"><i /> CRAFT / ЛИЧНЫЙ КАБИНЕТ</p>
        <h1>С возвращением<br /><em>к своему делу.</em></h1>
        <p className="auth-intro">Войди, чтобы продолжить работу над своим цифровым продуктом.</p>
        {params.error && <p className="auth-message error">{messages[params.error] ?? "Не удалось выполнить вход."}</p>}
        <form action={signIn} className="auth-form">
          <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Пароль<input name="password" type="password" autoComplete="current-password" placeholder="Твой пароль" required /></label>
          <button className="button button-dark auth-submit" type="submit">Войти в аккаунт <span>↗</span></button>
        </form>
        <p className="auth-switch">Ещё нет аккаунта? <Link href="/register">Зарегистрироваться</Link></p>
      </section>
    </main>
  );
}
