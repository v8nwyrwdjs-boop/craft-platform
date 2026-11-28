import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { activateEnrollment, reviewSubmission } from "@/app/actions/staff";

const notices: Record<string, string> = {
  review: "Проверь текст обратной связи и статус.",
  missing: "Отправка не найдена или у тебя нет доступа.",
  feedback: "Не удалось сохранить обратную связь.",
  status: "Обратная связь сохранена, но статус отправки не обновился.",
  "student-id": "Укажи корректный UUID пользователя.",
  enrollment: "Не удалось активировать зачисление.",
};

const date = (value: string) => new Date(value).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; reviewed?: string; enrolled?: string }> }) {
  const query = await searchParams;
  if (!hasSupabaseConfig()) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const role = user.app_metadata?.role;
  if (!["admin", "mentor"].includes(role)) redirect("/dashboard");

  const [{ data: submissions }, { data: students }, { data: projects }, { data: enrollments }, { count: studentCount }, { count: projectCount }, { count: activeCount }] = await Promise.all([
    supabase.from("assignment_submissions").select("id,student_id,lesson_slug,response,status,submitted_at").order("submitted_at", { ascending: false }).limit(40),
    supabase.from("profiles").select("id,display_name,created_at").order("created_at", { ascending: false }).limit(30),
    supabase.from("student_projects").select("id,student_id,title,stage,status,updated_at").order("updated_at", { ascending: false }).limit(30),
    supabase.from("enrollments").select("id,student_id,program_slug,status,enrolled_at").order("enrolled_at", { ascending: false }).limit(30),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("student_projects").select("*", { count: "exact", head: true }),
    supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "active"),
  ]);
  const allIds = Array.from(new Set([...(submissions ?? []).map(x => x.student_id), ...(projects ?? []).map(x => x.student_id), ...(enrollments ?? []).map(x => x.student_id)]));
  const { data: relatedProfiles } = allIds.length ? await supabase.from("profiles").select("id,display_name").in("id", allIds) : { data: [] as {id:string;display_name:string}[] };
  const names = new Map((relatedProfiles ?? []).map(x => [x.id, x.display_name || "Участник"]));

  return (
    <main className="admin-shell">
      <header className="admin-top wrap">
        <Link className="brand" href="/">CRAFT<span>®</span></Link>
        <div className="admin-top-right"><span className="admin-role">{role === "admin" ? "АДМИНИСТРАТОР" : "НАСТАВНИК"}</span><Link href="/messages">Сообщения ↗</Link><Link href="/dashboard">Личный кабинет ↗</Link></div>
      </header>
      <section className="admin-hero wrap">
        <div><p className="eyebrow"><i /> CRAFT / CONTROL ROOM</p><h1>Управляй<br /><em>движением.</em></h1><p>Рабочее пространство команды: ученики, проекты, обучение и обратная связь — в одном месте.</p></div>
        <div className="admin-hero-aside"><span>СЕССИЯ</span><strong>{user.email}</strong><small>Данные обновляются при открытии панели</small></div>
      </section>
      <section className="admin-content wrap">
        {query.error && <p className="auth-message error">{notices[query.error] ?? "Операция не выполнена."}</p>}
        {query.reviewed && <p className="auth-message success">Обратная связь сохранена и статус работы обновлён.</p>}
        {query.enrolled && <p className="auth-message success">Доступ к программе активирован.</p>}
        <div className="admin-stat-grid">
          <article className="admin-stat"><span>УЧЕНИКИ</span><strong>{studentCount ?? students?.length ?? 0}</strong><small>Зарегистрированные профили</small></article>
          <article className="admin-stat"><span>АКТИВНЫЕ ДОСТУПЫ</span><strong>{activeCount ?? 0}</strong><small>Действующие зачисления</small></article>
          <article className="admin-stat"><span>ПРОЕКТЫ</span><strong>{projectCount ?? projects?.length ?? 0}</strong><small>Созданные проекты учеников</small></article>
          <article className="admin-stat"><span>РАБОТЫ НА ПРОВЕРКЕ</span><strong>{(submissions ?? []).filter(x => x.status === "submitted" || x.status === "reviewing").length}</strong><small>Последние 40 отправок</small></article>
        </div>

        {role === "admin" && <section className="admin-panel admin-enroll-panel" id="access">
          <div><p className="eyebrow">УПРАВЛЕНИЕ ДОСТУПОМ</p><h2>Добавить ученика в программу</h2><p>Вставь UUID аккаунта из списка учеников ниже. Сейчас доступ выдаётся к базовой программе CRAFT.</p></div>
          <form action={activateEnrollment}><input name="student_id" placeholder="UUID пользователя" aria-label="UUID пользователя" required/><button type="submit">Выдать доступ ↗</button></form>
        </section>}

        <section className="admin-section" id="students">
          <div className="admin-section-head"><div><p className="eyebrow">01 / СООБЩЕСТВО</p><h2>Ученики</h2></div><span>{studentCount ?? students?.length ?? 0} аккаунтов</span></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Участник</th><th>Идентификатор</th><th>Регистрация</th><th>Действие</th></tr></thead><tbody>
            {(students ?? []).map(student => <tr key={student.id}><td><strong>{student.display_name || "Новый участник"}</strong><small>Ученик CRAFT</small></td><td><code>{student.id}</code></td><td>{date(student.created_at)}</td><td><a href={`#access`}>Выдать доступ ↗</a></td></tr>)}
            {!students?.length && <tr><td colSpan={4}>Пока нет зарегистрированных учеников.</td></tr>}
          </tbody></table></div>
          <p className="admin-footnote">Показаны последние 30 профилей. Email-адреса и управление аккаунтами Auth пока не выводятся в этой панели.</p>
        </section>

        <section className="admin-section" id="projects">
          <div className="admin-section-head"><div><p className="eyebrow">02 / СОЗДАНИЕ</p><h2>Проекты учеников</h2></div><span>{projectCount ?? projects?.length ?? 0} проектов</span></div>
          <div className="admin-record-grid">{(projects ?? []).map(project => <article className="admin-record" key={project.id}><div><span>{project.stage || "Идея"}</span><small>{date(project.updated_at)}</small></div><h3>{project.title}</h3><p>{names.get(project.student_id) || "Участник"}</p><b>{project.status || "В работе"}</b></article>)}
          {!projects?.length && <div className="admin-empty">Проекты учеников появятся здесь после создания в личном кабинете.</div>}</div>
        </section>

        <section className="admin-section" id="enrollments">
          <div className="admin-section-head"><div><p className="eyebrow">03 / ОБУЧЕНИЕ</p><h2>Доступы к программам</h2></div><span>{enrollments?.length ?? 0} записей в списке</span></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Ученик</th><th>Программа</th><th>Статус</th><th>Дата</th></tr></thead><tbody>
            {(enrollments ?? []).map(item => <tr key={item.id}><td>{names.get(item.student_id) || item.student_id.slice(0,8)}</td><td>{item.program_slug}</td><td><span className={item.status === "active" ? "admin-status active" : "admin-status"}>{item.status}</span></td><td>{date(item.enrolled_at)}</td></tr>)}
            {!enrollments?.length && <tr><td colSpan={4}>Пока нет зачислений.</td></tr>}
          </tbody></table></div>
        </section>

        <section className="admin-section" id="reviews">
          <div className="admin-section-head"><div><p className="eyebrow">04 / НАСТАВНИЧЕСТВО</p><h2>Проверка работ</h2></div><span>{submissions?.length ?? 0} последних работ</span></div>
          {submissions?.length ? <div className="admin-review-list">{submissions.map(item => <article className="admin-review" key={item.id}>
            <div className="admin-review-meta"><strong>{names.get(item.student_id) || "Ученик"}</strong><span>{item.lesson_slug}</span><span>{date(item.submitted_at)}</span><span className="admin-status">{item.status}</span></div>
            <p className="admin-review-answer">{item.response}</p>
            <form action={reviewSubmission} className="staff-review-form"><input type="hidden" name="submission_id" value={item.id}/><label>Комментарий наставника<textarea name="feedback" minLength={2} maxLength={10000} placeholder="Отметь сильные стороны, предложи улучшения и следующий шаг..." required/></label><div><select name="status" defaultValue={item.status === "submitted" ? "reviewing" : item.status}><option value="reviewing">На проверке</option><option value="revision_requested">Нужны доработки</option><option value="accepted">Принято</option></select><button type="submit">Отправить обратную связь ↗</button></div></form>
          </article>)}</div> : <div className="admin-empty">Когда ученики отправят задания, они появятся здесь.</div>}
        </section>
      </section>
      <footer className="admin-footer wrap"><Link className="brand" href="/">CRAFT<span>®</span></Link><span>Управление школой · {new Date().getFullYear()}</span><Link href="/">Открыть сайт ↗</Link></footer>
    </main>
  );
}
