import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { createOwnProject } from "@/app/actions/projects";

export default async function DashboardPage({ searchParams }: { searchParams: { error?: string; saved?: string } }) {
  if (!hasSupabaseConfig()) {
    return <main className="dashboard-shell"><header className="auth-top"><Link className="brand" href="/">CRAFT<span>®</span></Link></header><section className="dashboard-welcome"><p className="eyebrow">CRAFT / ЛИЧНЫЙ КАБИНЕТ</p><h1>Рабочее пространство<br /><em>твоего продукта.</em></h1><p>Интерфейс кабинета готов. Чтобы включить реальные аккаунты, нужно подключить Supabase и применить SQL-схему из репозитория.</p><Link className="button button-dark" href="/register">Создать аккаунт <span>↗</span></Link></section></main>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Участник";
  const { data: projects } = await supabase.from("student_projects").select("id,title,stage,status,updated_at").eq("student_id", user.id).order("updated_at", { ascending: false });

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header wrap">
        <Link className="brand" href="/">CRAFT<span>®</span></Link>
        <div className="dashboard-user"><span>{user.email}</span><form action={signOut}><button type="submit">Выйти ↗</button></form></div>
      </header>
      <section className="dashboard-welcome wrap">
        <p className="eyebrow"><i /> ЛИЧНЫЙ КАБИНЕТ / CRAFT</p>
        <h1>Привет, {displayName}.<br /><em>Пора создавать.</em></h1>
        <p>Твоё рабочее пространство: идеи, проекты и следующий шаг к собственному цифровому продукту.</p>
      </section>
      <section className="dashboard-content wrap">
        {searchParams.saved && <p className="auth-message success">Проект сохранён в твоём кабинете.</p>}
        {searchParams.error && <p className="auth-message error">Не удалось сохранить проект. Проверь название и попробуй ещё раз.</p>}
        <div className="dashboard-section-title"><div><p className="eyebrow">ТВОЯ РАБОТА</p><h2>Мои проекты</h2></div><Link className="button button-dark" href="/directions">Найти идею <span>↗</span></Link></div>
        {projects?.length ? <div className="student-project-grid">{projects.map((project) => <article className="student-project" key={project.id}><span>{project.stage ?? "Идея"}</span><h3>{project.title}</h3><p>{project.status ?? "В работе"}</p><time>{new Date(project.updated_at).toLocaleDateString("ru-RU")}</time></article>)}</div> : <div className="dashboard-empty"><span>✳</span><h3>Твой первый проект начнётся здесь.</h3><p>Выбери бизнес-направление, изучи концепции или добавь собственную идею.</p><div><Link href="/directions">Выбрать направление ↗</Link><Link href="/products">Посмотреть концепции ↗</Link></div></div>}
        <div className="new-project-panel"><div><p className="eyebrow">СВОЯ ИДЕЯ</p><h3>Уже знаешь, что хочешь создать?</h3><p>Добавь проект и сохрани его в личном кабинете.</p></div><form action={createOwnProject}><input name="title" minLength={3} maxLength={140} placeholder="Название или краткое описание идеи" required/><button type="submit">Создать проект ↗</button></form></div>
        <div className="learning-preview"><div><p className="eyebrow">ПРОГРАММА CRAFT</p><h2>От идеи к запуску</h2><p>Учебные материалы и задания появятся здесь после зачисления в программу.</p><Link href="/learn">Посмотреть программу ↗</Link></div><span>ДОСТУП К УРОКАМ — ПОСЛЕ ЗАЧИСЛЕНИЯ</span></div>
      </section>
    </main>
  );
}
