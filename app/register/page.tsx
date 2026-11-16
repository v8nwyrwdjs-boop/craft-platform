import Link from "next/link";
import { signUp } from "@/app/actions/auth";

const messages: Record<string, string> = {
  setup: "Регистрация пока не подключена: требуется настроить Supabase.",
  validation: "Проверь имя, email и пароль (не менее 8 символов).",
  signup: "Не удалось создать аккаунт. Возможно, этот email уже зарегистрирован.",
};

export default async function RegisterPage({ searchParams }: { searchParams: { error?: string; success?: string } }) {
  const params = searchParams;
  return (
    <main className="auth-shell">
      <header className="auth-top"><Link className="brand" href="/">CRAFT<span>®</span></Link><Link href="/">На главную ↗</Link></header>
      <section className="auth-card">
        <p className="eyebrow"><i /> CRAFT / СОЗДАНИЕ АККАУНТА</p>
        <h1>Начни свой<br /><em>проект.</em></h1>
        <p className="auth-intro">Создай аккаунт, чтобы сохранять идеи, вести проект и проходить обучение в одном месте.</p>
        {params.error && <p className="auth-message error">{messages[params.error] ?? "Что-то пошло не так. Попробуй ещё раз."}</p>}
        {params.success === "confirm" && <p className="auth-message success">Аккаунт почти готов. Проверь почту и перейди по ссылке подтверждения.</p>}
        <form action={signUp} className="auth-form">
          <label>Как к тебе обращаться<input name="name" type="text" autoComplete="name" placeholder="Имя" minLength={2} required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Пароль<input name="password" type="password" autoComplete="new-password" placeholder="Не менее 8 символов" minLength={8} required /></label>
          <button className="button button-dark auth-submit" type="submit">Создать аккаунт <span>↗</span></button>
        </form>
        <p className="auth-legal">Создавая аккаунт, ты соглашаешься с условиями использования и политикой конфиденциальности. Перед открытым запуском эти документы должны быть опубликованы.</p>
        <p className="auth-switch">Уже есть аккаунт? <Link href="/login">Войти</Link></p>
      </section>
    </main>
  );
}
