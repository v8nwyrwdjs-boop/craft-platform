import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ChatNotice } from "@/components/chat-notice";
import { ChatThread } from "@/components/chat-thread";
import { chatKindFor, isStaffRole, isUuid } from "@/lib/chat";
import { loadMessages } from "@/lib/chat-data";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Чат с учеником", robots: { index: false, follow: false } };

type Props = { params: Promise<{ thread: string }>; searchParams: Promise<{ error?: string }> };

export default async function StaffThreadPage({ params, searchParams }: Props) {
  const { thread: threadId } = await params;
  const query = await searchParams;
  if (!isUuid(threadId)) notFound();
  if (!hasSupabaseConfig()) return <ChatNotice title="Чат пока не включён">Чат пока не включён на сервере. Попробуйте позже.</ChatNotice>;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/messages/${threadId}`)}`);
  const role = user.app_metadata?.role;
  if (!isStaffRole(role)) redirect("/messages");

  const { data: thread, error } = await supabase.from("chat_threads").select("id,student_id,status").eq("id", threadId).maybeSingle();
  if (error) return <ChatNotice title="Чат пока не включён">Чат пока не включён на сервере. Попробуйте позже.</ChatNotice>;
  if (!thread) notFound();

  const [{ data: profile }, loaded] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", thread.student_id).maybeSingle(),
    loadMessages(supabase, thread.id, user.id),
  ]);
  if (!loaded) return <ChatNotice title="Чат пока не включён">Чат пока не включён на сервере. Попробуйте позже.</ChatNotice>;

  const name = String(profile?.display_name ?? "").trim() || `Ученик ${thread.student_id.slice(0, 8)}`;
  const asStudent = chatKindFor(role, user.id, thread.student_id) === "student";
  return (
    <ChatThread
      threadId={thread.id}
      status={thread.status === "closed" ? "closed" : "open"}
      heading={<h1 id="chat-title" className="f-display f-h1 f-h1--page">{name}</h1>}
      lead={asStudent ? "Это ваш собственный чат: вы пишете как ученик." : "Вы отвечаете как команда CRAFT: ученик видит ваши ответы под этим именем."}
      back={{ href: "/messages", label: "Все чаты" }}
      canManage={role === "admin"}
      notice={query.error === "status" ? "Не получилось изменить статус чата." : undefined}
      {...loaded}
    />
  );
}
