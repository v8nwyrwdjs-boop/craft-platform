import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { curriculum } from "@/lib/curriculum";

export default async function LearnPage({ searchParams }: { searchParams: Promise<{ completed?: string; locked?: string; error?: string }> }) {
  const query = await searchParams;
  if (!hasSupabaseConfig()) return <main className="dashboard-shell"><header className="auth-top"><Link className="brand" href="/">CRAFT<span>®</span></Link></header><section className="dashboard-welcome wrap"><p className="eyebrow">CRAFT / ПРОГРАММА</p><h1>Путь от идеи<br /><em>до запуска.</em></h1><p>Программа включает шесть этапов. Чтобы открыть учебные материалы, подключи аккаунт и получи зачисление в поток.</p><Link className="button button-dark" href="/register">Создать аккаунт ↗</Link></section></main>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: enrollment } = await supabase.from("enrollments").select("id,status").eq("student_id",user.id).eq("program_slug","craft-foundation").eq("status","active").maybeSingle();
  const { data: progress } = await supabase.from("lesson_progress").select("lesson_slug,status").eq("student_id",user.id).eq("program_slug","craft-foundation");
  const completed = new Set((progress ?? []).filter((item)=>item.status==="completed").map((item)=>item.lesson_slug));
  const totalLessons = curriculum.reduce((sum,item)=>sum+item.lessons.length,0);
  return <main className="dashboard-shell"><header className="dashboard-header wrap"><Link className="brand" href="/">CRAFT<span>®</span></Link><Link href="/dashboard">Мой кабинет ↗</Link></header><section className="dashboard-welcome wrap"><p className="eyebrow">CRAFT / УЧЕБНАЯ ПРОГРАММА</p><h1>От идеи<br /><em>до запуска.</em></h1><p>Шесть последовательных этапов. Каждый заканчивается конкретным результатом для твоего продукта.</p></section><section className="dashboard-content wrap">{query.completed&&<p className="auth-message success">Урок отмечен как завершённый.</p>}{query.error&&<p className="auth-message error">Не удалось обновить прогресс. Попробуй ещё раз.</p>}{query.locked&&<p className="auth-message error">Доступ к программе пока не активирован.</p>}<div className="learning-progress"><b>{completed.size} / {totalLessons}</b><span>уроков завершено</span><div><i style={{width:(completed.size/totalLessons*100)+"%"}}/></div></div>{!enrollment&&<div className="enrollment-note"><b>Программа пока не активирована.</b><p>Аккаунт CRAFT бесплатный. Доступ к учебным материалам открывается отдельно после зачисления в программу.</p></div>}<div className="curriculum-list">{curriculum.map((item)=>{const count=item.lessons.filter((_,i)=>completed.has(item.slug+"-"+(i+1))).length;return <article className="curriculum-card" key={item.slug}><div className="curriculum-number">{item.number}</div><div className="curriculum-main"><h2>{item.title}</h2><p>{item.result}</p><span>{count} / {item.lessons.length} уроков</span></div>{enrollment?<Link href={"/learn/"+item.slug}>Открыть этап ↗</Link>:<span className="curriculum-locked">Закрыто</span>}</article>})}</div></section></main>;
}
