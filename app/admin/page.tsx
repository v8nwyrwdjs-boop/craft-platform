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

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; reviewed?: string; enrolled?: string }> }) {
  const query = await searchParams;
  if (!hasSupabaseConfig()) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const role = user.app_metadata?.role;
  if (!["admin", "mentor"].includes(role)) redirect("/dashboard");

  const { data: submissions } = await supabase.from("assignment_submissions").select("id,student_id,lesson_slug,response,status,submitted_at").order("submitted_at", { ascending: false }).limit(100);
  const studentIds = [...new Set((submissions ?? []).map((item) => item.student_id))];
  const { data: profiles } = studentIds.length
    ? await supabase.from("profiles").select("id,display_name").in("id", studentIds)
    : { data: [] as { id: string; display_name: string }[] };
  const names = new Map((profiles ?? []).map((profile) => [profile.id, profile.display_name]));

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header wrap"><Link className="brand" href="/">CRAFT<span>®</span></Link><div className="dashboard-user"><span>{role === "admin" ? "Администратор" : "Наставник"}</span><Link href="/dashboard">Кабинет ↗</Link></div></header>
      <section className="dashboard-welcome wrap"><p className="eyebrow">CRAFT / ВНУТРЕННЯЯ ПАНЕЛЬ</p><h1>Работа с<br /><em>учениками.</em></h1><p>Проверка практических заданий и управление доступом к программе.</p></section>
      <section className="dashboard-content wrap">
        {query.error && <p className="auth-message error">{notices[query.error] ?? "Операция не выполнена."}</p>}
        {query.reviewed && <p className="auth-message success">Обратная связь сохранена.</p>}
        {query.enrolled && <p className="auth-message success">Доступ к программе активирован.</p>}
        {role === "admin" && <div className="staff-enroll"><div><p className="eyebrow">ДОСТУП К ПРОГРАММЕ</p><h2>Зачислить ученика</h2><p>Вставь UUID аккаунта из Supabase Auth. Регистрация сама по себе не открывает программу.</p></div><form action={activateEnrollment}><input name="student_id" placeholder="UUID пользователя" required/><button type="submit">Активировать доступ ↗</button></form></div>}
        <div className="dashboard-section-title"><div><p className="eyebrow">ОТПРАВЛЕННЫЕ РАБОТЫ</p><h2>Задания учеников</h2></div><span>{submissions?.length ?? 0} работ</span></div>
        {submissions?.length ? <div className="staff-submissions">{submissions.map((submission) => <article className="staff-submission" key={submission.id}>
          <div className="staff-submission-meta"><span>{names.get(submission.student_id) || "Ученик"}</span><span>{submission.lesson_slug}</span><span>{new Date(submission.submitted_at).toLocaleDateString("ru-RU")}</span><span>{submission.status}</span></div>
          <p className="staff-student-id">ID ученика: {submission.student_id}</p>
          <div className="staff-submission-response">{submission.response}</div>
          <form action={reviewSubmission} className="staff-review-form"><input type="hidden" name="submission_id" value={submission.id}/><label>Обратная связь<textarea name="feedback" minLength={2} maxLength={10000} placeholder="Что получилось, что стоит улучшить и какой следующий шаг..." required/></label><div><select name="status" defaultValue="reviewing"><option value="reviewing">На проверке</option><option value="revision_requested">Нужны доработки</option><option value="accepted">Принято</option></select><button type="submit">Отправить ученику ↗</button></div></form>
        </article>)}</div> : <div className="dashboard-empty"><h3>Пока нет отправленных заданий.</h3><p>Когда ученики начнут сдавать практические работы, они появятся здесь.</p></div>}
      </section>
    </main>
  );
}
