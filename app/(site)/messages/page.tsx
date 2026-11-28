import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { openChatThread } from "@/app/actions/chat";
import { ChatNotice } from "@/components/chat-notice";
import { ChatThread } from "@/components/chat-thread";
import { ChatTime } from "@/components/chat-time";
import { isStaffRole, isUnread, sortThreads, waitingForTeam, type ChatKind } from "@/lib/chat";
import { loadMessages } from "@/lib/chat-data";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Сообщения", robots: { index: false, follow: false } };

type Db = Awaited<ReturnType<typeof createClient>>;
const SETUP = "Чат пока не включён на сервере. Попробуйте позже.";

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  if (!hasSupabaseConfig()) return <ChatNotice title="Чат пока не включён">{SETUP}</ChatNotice>;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/messages");

  const role = user.app_metadata?.role;
  if (isStaffRole(role)) return <StaffInbox db={supabase} userId={user.id} isAdmin={role === "admin"} failed={query.error} />;
  return <StudentChat db={supabase} userId={user.id} />;
}

async function StudentChat({ db, userId }: { db: Db; userId: string }) {
  const { data: thread, error } = await db.from("chat_threads").select("id,status").eq("student_id", userId).maybeSingle();
  if (error) return <ChatNotice title="Чат пока не включён">{SETUP}</ChatNotice>;
  if (!thread) {
    return <ChatNotice title="Чат пока не открыт">Команда CRAFT открывает чат вручную для учеников с активной записью. Сроков мы не обещаем.</ChatNotice>;
  }
  const loaded = await loadMessages(db, thread.id, userId);
  if (!loaded) return <ChatNotice title="Чат пока не включён">{SETUP}</ChatNotice>;
  return (
    <ChatThread
      threadId={thread.id}
      status={thread.status === "closed" ? "closed" : "open"}
      heading={<h1 id="chat-title" className="f-display f-h1 f-h1--page">Чат с командой</h1>}
      lead="Пишите о своём проекте. Сообщения видят только вы и команда CRAFT: наставники и администраторы."
      back={{ href: "/dashboard", label: "В кабинет" }}
      canManage={false}
      {...loaded}
    />
  );
}

const noticeFor = (code?: string) =>
  code === "student" ? "Не получилось открыть чат: неверный идентификатор ученика."
  : code === "open" ? "Не получилось открыть чат. У ученика должна быть активная запись, а открыть чат может только администратор."
  : code === "status" ? "Не получилось изменить статус чата."
  : "";

async function StaffInbox({ db, userId, isAdmin, failed }: { db: Db; userId: string; isAdmin: boolean; failed?: string }) {
  const { data: threads, error } = await db
    .from("chat_threads")
    .select("id,student_id,status,created_at,last_message_at,last_author_kind")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !threads) return <ChatNotice title="Чат пока не включён">{SETUP}</ChatNotice>;

  // Ученики с активной записью без чата: их администратор может открыть одним нажатием.
  let candidateIds: string[] = [];
  if (isAdmin) {
    const { data: enrolled } = await db.from("enrollments").select("student_id").eq("status", "active").limit(300);
    const have = new Set(threads.map((t) => t.student_id));
    candidateIds = Array.from(new Set((enrolled ?? []).map((e) => e.student_id as string))).filter((id) => !have.has(id)).slice(0, 50);
  }

  const ids = [...threads.map((t) => t.student_id as string), ...candidateIds];
  const [profiles, reads] = await Promise.all([
    ids.length ? db.from("profiles").select("id,display_name").in("id", ids) : Promise.resolve({ data: [] as { id: string; display_name: string }[] }),
    db.from("chat_reads").select("thread_id,last_read_at").eq("user_id", userId),
  ]);
  const names = new Map((profiles.data ?? []).map((p) => [p.id as string, String(p.display_name ?? "").trim()]));
  const nameOf = (id: string) => names.get(id) || `Ученик ${id.slice(0, 8)}`;
  const readAt = new Map((reads.data ?? []).map((r) => [r.thread_id as string, r.last_read_at as string]));
  const notice = noticeFor(failed);

  return (
    <section className="f-section f-ground-paper" aria-labelledby="chat-title">
      <div className="f-wrap f-chat">
        <Link className="f-back" href="/admin">
          ← Панель команды
        </Link>
        <header className="f-chat__head">
          <h1 id="chat-title" className="f-display f-h1 f-h1--page">
            Сообщения
          </h1>
          <p className="f-lead">Чаты с учениками. Сверху те, где последним написал ученик.</p>
        </header>
        {notice && (
          <p className="f-note" data-tone="bad" role="alert">
            {notice}
          </p>
        )}
        {threads.length === 0 ? (
          <p className="f-note">Чатов пока нет.{isAdmin ? " Откройте первый ниже." : " Их открывает администратор."}</p>
        ) : (
          <ul className="f-chats">
            {sortThreads(threads.map((t) => ({ ...t, last_author_kind: t.last_author_kind as ChatKind | null }))).map((t) => {
              const unread = isUnread(t, "staff", readAt.get(t.id) ?? null);
              return (
                <li key={t.id}>
                  <Link href={`/messages/${t.id}`} data-unread={unread}>
                    <span className="f-chats__name">
                      {unread && <span className="f-sr">Не прочитано. </span>}
                      {nameOf(t.student_id)}
                    </span>
                    <span className="f-chats__state">
                      {waitingForTeam(t) ? <span className="f-status" data-s="open">Ждёт ответа</span> : t.last_message_at ? "Ответили" : "Без сообщений"}
                      {t.status === "closed" ? " · закрыт" : ""}
                    </span>
                    <ChatTime iso={t.last_message_at ?? t.created_at} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {isAdmin && candidateIds.length > 0 && (
          <section aria-labelledby="open-title" className="f-chat__open">
            <h2 id="open-title" className="f-display f-h2">
              Открыть чат
            </h2>
            <p className="f-small f-muted">Ученики с активной записью, у которых чата ещё нет.</p>
            <ul className="f-chats">
              {candidateIds.map((id) => (
                <li key={id}>
                  <form action={openChatThread}>
                    <input type="hidden" name="student_id" value={id} />
                    <span className="f-chats__name">{nameOf(id)}</span>
                    <button className="f-btn f-btn--ghost" type="submit">
                      Открыть чат
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
