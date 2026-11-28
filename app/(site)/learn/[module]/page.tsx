import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { submitAssignment } from "@/app/actions/assignments";
import { completeLesson } from "@/app/actions/learning";
import { curriculum } from "@/lib/curriculum";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Этап программы", robots: { index: false, follow: false } };

export default async function ModulePage({ params, searchParams }: { params: Promise<{ module: string }>; searchParams: Promise<{ submitted?: string; error?: string }> }) {
  const { module: moduleSlug } = await params;
  const query = await searchParams;
  const item = curriculum.find((module) => module.slug === moduleSlug);
  if (!item) notFound();
  if (!hasSupabaseConfig()) redirect("/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/learn/${item.slug}`)}`);
  const { data: enrollment } = await supabase.from("enrollments").select("id").eq("student_id", user.id).eq("program_slug", "craft-foundation").eq("status", "active").maybeSingle();
  if (!enrollment) redirect("/learn?locked=1");
  const { data: progress } = await supabase.from("lesson_progress").select("lesson_slug,status").eq("student_id", user.id).eq("program_slug", "craft-foundation");
  const { data: submissions } = await supabase.from("assignment_submissions").select("id,lesson_slug,response,status,submitted_at").eq("student_id", user.id).eq("program_slug", "craft-foundation").order("submitted_at", { ascending: false });
  const { data: feedback } = await supabase.from("mentor_feedback").select("submission_id,body,created_at").eq("student_id", user.id).order("created_at", { ascending: false });
  const completed = new Set((progress ?? []).filter((p) => p.status === "completed").map((p) => p.lesson_slug));
  const stage = curriculum.indexOf(item) + 1;

  return (
    <section className="f-section f-ground-paper" aria-labelledby="module-title">
      <div className="f-wrap f-account">
        <div className="f-account__head">
          <Link className="f-back" href="/learn">← Все этапы</Link>
          <h1 id="module-title" className="f-display f-h1 f-h1--page">{item.title}</h1>
          <p className="f-lead">Этап {stage}. Результат: {item.result.charAt(0).toLowerCase() + item.result.slice(1)}.</p>
        </div>

        {query.submitted && <p className="f-note" data-tone="good" role="status">Ответ отправлен и сохранён в вашем кабинете.</p>}
        {query.error && <p className="f-note" data-tone="bad" role="alert">Не удалось отправить ответ. Проверьте текст и попробуйте ещё раз.</p>}

        <ol className="f-lessons">
          {item.lessons.map(({ title, body, task, deliverable }, index) => {
            const slug = `${item.slug}-${index + 1}`;
            const submission = (submissions ?? []).find((entry) => entry.lesson_slug === slug);
            const notes = submission ? (feedback ?? []).filter((note) => note.submission_id === submission.id) : [];
            return (
              <li key={slug}>
                <article className="f-lesson">
                  <h2>Урок {index + 1}. {title}</h2>
                  <p>{body}</p>
                  <div>
                    <h3>Практическое задание</h3>
                    <p>{task}</p>
                  </div>
                  <div>
                    <h3>Результат урока</h3>
                    <p>{deliverable}</p>
                  </div>
                </article>
                <div className="f-lesson__side">
                  {submission && (
                    <>
                      <p className="f-small f-muted">
                        Последний ответ: {new Date(submission.submitted_at).toLocaleDateString("ru-RU")} · {submission.status === "submitted" ? "отправлен" : submission.status}
                      </p>
                      <details className="f-lesson">
                        <summary>Посмотреть отправленный ответ</summary>
                        <p className="f-lesson__response">{submission.response}</p>
                      </details>
                    </>
                  )}
                  {notes.map((note) => (
                    <div className="f-note" data-tone="good" key={note.submission_id + note.created_at}>
                      <p className="f-small f-muted">Обратная связь наставника · {new Date(note.created_at).toLocaleDateString("ru-RU")}</p>
                      <p className="f-lesson__response">{note.body}</p>
                    </div>
                  ))}
                  <form action={submitAssignment}>
                    <input type="hidden" name="lesson_slug" value={slug} />
                    <input type="hidden" name="module_slug" value={item.slug} />
                    <div className="f-field">
                      <label htmlFor={`response-${slug}`}>Ваш ответ и результат</label>
                      <textarea id={`response-${slug}`} name="response" minLength={20} maxLength={20000} required />
                    </div>
                    <button className="f-btn" type="submit">Отправить задание</button>
                  </form>
                  {completed.has(slug) ? (
                    <p className="f-status" data-s="open">Урок завершён</p>
                  ) : (
                    <form action={completeLesson}>
                      <input type="hidden" name="lesson_slug" value={slug} />
                      <button className="f-btn f-btn--ghost" type="submit">Отметить выполненным</button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="f-actions">
          <Link className="f-link" href="/learn">← Вернуться к программе</Link>
        </div>
      </div>
    </section>
  );
}
