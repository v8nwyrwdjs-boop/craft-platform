import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { createOwnProject } from "@/app/actions/projects";
import { isStaffRole } from "@/lib/chat";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Кабинет", robots: { index: false, follow: false } };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const query = await searchParams;
  if (!hasSupabaseConfig()) {
    return (
      <section className="f-section f-ground-paper" aria-labelledby="account-title">
        <div className="f-wrap f-account">
          <div className="f-account__head">
            <h1 id="account-title" className="f-display f-h1 f-h1--page">Кабинет</h1>
            <p className="f-lead">Кабинет заработает, когда на сайте включат аккаунты. Здесь будут ваши проекты и обучение.</p>
          </div>
          <div className="f-actions">
            <Link className="f-btn" href="/register">Создать аккаунт</Link>
          </div>
        </div>
      </section>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "участник";
  const { data: projects } = await supabase.from("student_projects").select("id,title,stage,status,updated_at").eq("student_id", user.id).order("updated_at", { ascending: false });

  return (
    <section className="f-section f-ground-paper" aria-labelledby="account-title">
      <div className="f-wrap f-account">
        <div className="f-account__head">
          <h1 id="account-title" className="f-display f-h1 f-h1--page">Привет, {displayName}</h1>
          <p className="f-lead">Здесь ваши проекты и следующий шаг к собственному цифровому продукту.</p>
          <nav className="f-account__bar" aria-label="Аккаунт">
            <span className="f-small f-muted">{user.email}</span>
            <Link className="f-link" href="/messages">Чат</Link>
            {isStaffRole(user.app_metadata?.role) && <Link className="f-link" href="/admin">Панель команды</Link>}
            <form action={signOut}>
              <button className="f-btn f-btn--ghost" type="submit">Выйти</button>
            </form>
          </nav>
        </div>

        {query.saved && <p className="f-note" data-tone="good" role="status">Проект сохранён в вашем кабинете.</p>}
        {query.error && <p className="f-note" data-tone="bad" role="alert">Не удалось сохранить проект. Проверьте название и попробуйте ещё раз.</p>}

        <section className="f-account__block" aria-labelledby="projects-title">
          <h2 id="projects-title" className="f-display f-h2">Мои проекты</h2>
          {projects?.length ? (
            <ul className="f-index">
              {projects.map((project) => (
                <li key={project.id}>
                  <h3>{project.title}</h3>
                  <p className="f-index__result">
                    {project.status ?? "В работе"} · <time dateTime={project.updated_at}>{new Date(project.updated_at).toLocaleDateString("ru-RU")}</time>
                  </p>
                  <div className="f-index__side">
                    <span className="f-status">{project.stage ?? "Идея"}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="f-lead">Первый проект начнётся здесь. Выберите направление, изучите продукты или добавьте свою идею ниже.</p>
              <div className="f-actions">
                <Link className="f-btn" href="/directions">Выбрать направление</Link>
                <Link className="f-btn f-btn--ghost" href="/products">Посмотреть продукты</Link>
              </div>
            </>
          )}
        </section>

        <section className="f-account__block" aria-labelledby="idea-title">
          <h2 id="idea-title" className="f-display f-h2">Своя идея</h2>
          <p className="f-lead">Уже знаете, что хотите создать? Сохраните идею в кабинете.</p>
          <form action={createOwnProject} className="f-account__form">
            <div className="f-field">
              <label htmlFor="project-title">Название или краткое описание идеи</label>
              <input id="project-title" name="title" minLength={3} maxLength={140} required />
            </div>
            <button className="f-btn" type="submit">Создать проект</button>
          </form>
        </section>

        <section className="f-account__block" aria-labelledby="program-title">
          <h2 id="program-title" className="f-display f-h2">Программа CRAFT</h2>
          <p className="f-lead">От идеи к запуску: учебные материалы и задания открываются здесь после зачисления в программу.</p>
          <div className="f-actions">
            <Link className="f-btn f-btn--ghost" href="/learn">Посмотреть программу</Link>
          </div>
        </section>
      </div>
    </section>
  );
}
