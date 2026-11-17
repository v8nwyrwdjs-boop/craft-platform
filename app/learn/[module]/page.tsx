import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { completeLesson } from "@/app/actions/learning";
import { submitAssignment } from "@/app/actions/assignments";
import { curriculum } from "@/lib/curriculum";

export default async function ModulePage({ params, searchParams }: { params: Promise<{ module: string }>; searchParams: Promise<{ submitted?: string; error?: string }> }) {
  const { module: moduleSlug } = await params;
  const query = await searchParams;
  const item = curriculum.find((module)=>module.slug===moduleSlug);
  if (!item) notFound();
  if (!hasSupabaseConfig()) redirect("/login");
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const {data:enrollment}=await supabase.from("enrollments").select("id").eq("student_id",user.id).eq("program_slug","craft-foundation").eq("status","active").maybeSingle();
  if(!enrollment) redirect("/learn?locked=1");
  const {data:progress}=await supabase.from("lesson_progress").select("lesson_slug,status").eq("student_id",user.id).eq("program_slug","craft-foundation");
  const {data:submissions}=await supabase.from("assignment_submissions").select("id,lesson_slug,response,status,submitted_at").eq("student_id",user.id).eq("program_slug","craft-foundation").order("submitted_at",{ascending:false});
  const {data:feedback}=await supabase.from("mentor_feedback").select("submission_id,body,created_at").eq("student_id",user.id).order("created_at",{ascending:false});
  const completed=new Set((progress??[]).filter((p)=>p.status==="completed").map((p)=>p.lesson_slug));
  return <main className="dashboard-shell"><header className="dashboard-header wrap"><Link className="brand" href="/">CRAFT<span>®</span></Link><Link href="/learn">Все этапы ↗</Link></header><section className="dashboard-welcome wrap"><p className="eyebrow">ПРОГРАММА CRAFT / ЭТАП {curriculum.indexOf(item)+1}</p><h1>{item.title}</h1><p>{item.result}</p></section><section className="dashboard-content wrap">{query.submitted&&<p className="auth-message success">Ответ отправлен и сохранён в твоём кабинете.</p>}{query.error&&<p className="auth-message error">Не удалось отправить ответ. Проверь, что он содержит не менее 20 символов.</p>}<div className="module-lesson-list">{item.lessons.map(({title,body,task},index)=>{const slug=item.slug+"-"+(index+1);const submission=(submissions??[]).find((entry)=>entry.lesson_slug===slug);return <article className="module-lesson" key={slug}><div><span>УРОК {String(index+1).padStart(2,"0")}</span><h2>{title}</h2><p>{body}</p><div className="lesson-task"><b>ПРАКТИЧЕСКОЕ ЗАДАНИЕ</b><p>{task}</p></div></div><div className="assignment-submit-area">{submission&&<p className="submission-status">Последний ответ: {new Date(submission.submitted_at).toLocaleDateString("ru-RU")} · {submission.status==="submitted"?"Отправлен":submission.status}</p>}{submission&&<details className="submission-preview"><summary>Посмотреть отправленный ответ</summary><p>{submission.response}</p></details>}{submission&&(feedback??[]).filter((note)=>note.submission_id===submission.id).map((note)=><div className="mentor-feedback" key={note.submission_id+note.created_at}><b>ОБРАТНАЯ СВЯЗЬ НАСТАВНИКА</b><p>{note.body}</p><time>{new Date(note.created_at).toLocaleDateString("ru-RU")}</time></div>)}<form action={submitAssignment} className="assignment-form"><input type="hidden" name="lesson_slug" value={slug}/><input type="hidden" name="module_slug" value={item.slug}/><label>Твой ответ и результат<textarea name="response" minLength={20} maxLength={20000} placeholder="Опиши, что ты сделал, какие выводы получил и что хочешь проверить дальше..." required /></label><button type="submit">Отправить задание ↗</button></form></div><div className="lesson-status">{completed.has(slug)?<span className="lesson-done">Завершён ✓</span>:<form action={completeLesson}><input type="hidden" name="lesson_slug" value={slug}/><button type="submit">Отметить выполненным</button></form>}</div></article>})}</div><Link className="text-link" href="/learn">← Вернуться к программе</Link></section></main>;
}
