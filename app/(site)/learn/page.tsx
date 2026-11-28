import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { curriculum } from "@/lib/curriculum";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Программа", robots: { index: false, follow: false } };

export default async function LearnPage({ searchParams }: { searchParams: Promise<{ completed?: string; locked?: string; error?: string }> }) {
  const query = await searchParams;
  if (!hasSupabaseConfig()) {
    return (
      <section className="f-section f-ground-paper" aria-labelledby="learn-title">
        <div className="f-wrap f-account">
          <div className="f-account__head">
            <h1 id="learn-title" className="f-display f-h1 f-h1--page">От идеи до запуска</h1>
            <p className="f-lead">Программа состоит из шести этапов. Чтобы открыть материалы, создайте аккаунт и получите зачисление в поток.</p>
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
  if (!user) redirect("/login?next=/learn");
  const { data: enrollment } = await supabase.from("enrollments").select("id,status").eq("student_id", user.id).eq("program_slug", "craft-foundation").eq("status", "active").maybeSingle();
  const { data: progress } = await supabase.from("lesson_progress").select("lesson_slug,status").eq("student_id", user.id).eq("program_slug", "craft-foundation");
  const completed = new Set((progress ?? []).filter((item) => item.status === "completed").map((item) => item.lesson_slug));
  const totalLessons = curriculum.reduce((sum, item) => sum + item.lessons.length, 0);

  return (
    <section className="f-section f-ground-paper" aria-labelledby="learn-title">
      <div className="f-wrap f-account">
        <div className="f-account__head">
          <Link className="f-back" href="/dashboard">← Кабинет</Link>
          <h1 id="learn-title" className="f-display f-h1 f-h1--page">От идеи до запуска</h1>
          <p className="f-lead">Шесть последовательных этапов. Каждый заканчивается конкретным результатом для вашего продукта.</p>
          <p className="f-statusline">
            <span className="f-status">{completed.size} из {totalLessons}</span> уроков завершено
          </p>
          <progress className="f-progress" value={completed.size} max={totalLessons} aria-label="Завершено уроков" />
        </div>

        {query.completed && <p className="f-note" data-tone="good" role="status">Урок отмечен как завершённый.</p>}
        {query.error && <p className="f-note" data-tone="bad" role="alert">Не удалось обновить прогресс. Попробуйте ещё раз.</p>}
        {query.locked && <p className="f-note" data-tone="bad" role="alert">Доступ к программе пока не активирован.</p>}
        {!enrollment && (
          <p className="f-note" data-tone="warn">
            Программа пока не активирована. Аккаунт CRAFT бесплатный, а доступ к учебным материалам открывается отдельно после зачисления в программу.
          </p>
        )}

        <div>
          <h2 className="f-sr">Этапы программы</h2>
          <ol className="f-index">
            {curriculum.map((item, index) => {
              const count = item.lessons.filter((_, i) => completed.has(`${item.slug}-${i + 1}`)).length;
              return (
                <li key={item.slug}>
                  <h3>{enrollment ? <Link href={`/learn/${item.slug}`}>{item.title}</Link> : item.title}</h3>
                  <p className="f-index__result">{item.result}</p>
                  <div className="f-index__side">
                    <span className="f-status" data-s={enrollment ? "open" : undefined}>
                      Этап {index + 1} · {count} из {item.lessons.length} уроков{enrollment ? "" : " · закрыт"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
