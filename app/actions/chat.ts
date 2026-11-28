"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { chatKindFor, isUuid, normalizeChatBody, type SendState } from "@/lib/chat";

/**
 * Чат ученик ↔ команда. Права проверяет база (RLS, supabase/migrations/202611280001_mentor_chat.sql);
 * проверки здесь нужны для понятных ответов и чтобы не отправлять заведомо недопустимое.
 * Роль берётся только из app_metadata, id автора — только из сессии, никогда из формы.
 */
async function sessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/messages");
  return { supabase, user };
}

export async function sendChatMessage(previous: SendState, formData: FormData): Promise<SendState> {
  const fail = (error: Exclude<SendState["error"], "">): SendState => ({ sent: previous.sent, error });
  if (!hasSupabaseConfig()) return fail("setup");

  const threadId = formData.get("thread_id");
  if (!isUuid(threadId)) return fail("invalid");
  const text = normalizeChatBody(formData.get("body"));
  if (!text.ok) return fail(text.error);

  const { supabase, user } = await sessionUser();
  const { data: thread, error: readError } = await supabase.from("chat_threads").select("id,student_id,status").eq("id", threadId).maybeSingle();
  if (readError) return fail("setup");
  if (!thread) return fail("missing");
  if (thread.status !== "open") return fail("closed");

  const kind = chatKindFor(user.app_metadata?.role, user.id, thread.student_id);
  if (!kind) return fail("missing");

  const { error } = await supabase.from("chat_messages").insert({ thread_id: thread.id, author_id: user.id, author_kind: kind, body: text.body });
  if (error) return fail(error.code === "42501" ? "denied" : "setup");

  revalidatePath("/messages");
  revalidatePath(`/messages/${thread.id}`);
  return { sent: previous.sent + 1, error: "" };
}

/** Отметка «прочитано» для текущего пользователя; видимость ветки проверяет политика chat_reads. */
export async function markChatRead(threadId: string): Promise<void> {
  if (!hasSupabaseConfig() || !isUuid(threadId)) return;
  const { supabase, user } = await sessionUser();
  await supabase.from("chat_reads").upsert({ thread_id: threadId, user_id: user.id, last_read_at: new Date().toISOString() }, { onConflict: "thread_id,user_id" });
}

/** Открыть ветку ученику с активной записью. Только администратор (политика "Admins can open chat threads"). */
export async function openChatThread(formData: FormData): Promise<void> {
  if (!hasSupabaseConfig()) redirect("/messages");
  const studentId = formData.get("student_id");
  const { supabase, user } = await sessionUser();
  if (user.app_metadata?.role !== "admin") redirect("/messages");
  if (!isUuid(studentId)) redirect("/messages?error=student");

  const { data, error } = await supabase.from("chat_threads").insert({ student_id: studentId, opened_by: user.id }).select("id").single();
  let threadId = data?.id;
  if (error?.code === "23505") {
    const existing = await supabase.from("chat_threads").select("id").eq("student_id", studentId).maybeSingle();
    threadId = existing.data?.id;
  }
  if (!threadId) redirect("/messages?error=open");
  revalidatePath("/messages");
  redirect(`/messages/${threadId}`);
}

/** Закрыть или снова открыть ветку. Только администратор. */
export async function setChatThreadStatus(formData: FormData): Promise<void> {
  if (!hasSupabaseConfig()) redirect("/messages");
  const threadId = formData.get("thread_id");
  const status = formData.get("status");
  const { supabase, user } = await sessionUser();
  if (user.app_metadata?.role !== "admin") redirect("/messages");
  if (!isUuid(threadId) || (status !== "open" && status !== "closed")) redirect("/messages?error=status");

  const { error } = await supabase.from("chat_threads").update({ status }).eq("id", threadId);
  if (error) redirect(`/messages/${threadId}?error=status`);
  revalidatePath("/messages");
  redirect(`/messages/${threadId}`);
}
