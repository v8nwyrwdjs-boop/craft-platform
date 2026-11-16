import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) {
    return <main className="dashboard-shell"><header className="auth-top"><Link className="brand" href="/">CRAFT<span>®</span></Link></header><section className="dashboard-welcome"><p className="eyebrow">CRAFT / ЛИЧНЫЙ КАБИНЕТ</p><h1>Рабочее пространство<br /><em>твоего продукта.</em></h1><p>Интерфейс кабинета подготовлен. Для включения регистрации и защищённых аккаунтов нужно подключить проект Supabase и добавить переменные окружения.</p><Link className="button button-dark" href="/register">К регистрации <span>↗</span></Link></section></main>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Участник";
  const { data: projects } = await supabase.from("student_projects").select("id,title,stage,status,updated_at").order("updated_at", { ascending: false });

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header wrap">
        <Link className="brand" href="/">CRAFT<span>®</span></Link>
        <div className="dashboard-user"><span>{user.email}</span><form action={signOut}><button type="submit">Выйти ↗</button></form></div>
      </header>
      <section className="dashboard-welcome wrap">
        <p className="eyebrow"><i /> ЛИЧНЫЙ КАБИНЕТ / CRAFT</p>
        <h1>Привет, {displayName}.<br /><em>Пора создавать.</em></h1>
        <p>Здесь будет жить твой путь: выбранная идея, материалы программы, задания и обратная связь.</p>
      </section>
      <section className="dashboard-content wrap">
        <div className="dashboard-section-title"><div><p className="eyebrow">ТВОЯ РАБОТА</p><h2>Мои проекты</h2></div><Link className="button button-dark" href="/directions">Найти идею <span>↗</span></Link></div>
        {projects?.length ? <div className="student-project-grid">{projects.map((project) => <article className="student-project" key={project.id}><span>{project.stage ?? "Идея"}</span><h3>{project.title}</h3><p>{project.status ?? "В работе"}</p></article>)}</div> : <div className="dashboard-empty"><span>✳</span><h3>Твой первый проект начнётся здесь.</h3><p>Пока проектов нет. Выбери направление или бизнес-концепцию — и сохрани её в своём пространстве.</p><div><Link href="/directions">Выбрать направление ↗</Link><Link href="/products">Посмотреть концепции ↗</Link></div></div>}
        <p className="dashboard-footnote">Учебные модули и обратная связь появятся здесь после подключения программы обучения.</p>
      </section>
    </main>
  );
}
