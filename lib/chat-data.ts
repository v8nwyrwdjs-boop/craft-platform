import type { createClient } from "@/lib/supabase/server";
import { CHAT_PAGE_SIZE, type ChatKind } from "@/lib/chat";
import type { ChatLogMessage } from "@/components/chat-log";

type Db = Awaited<ReturnType<typeof createClient>>;

/** Последние сообщения ветки по возрастанию времени; null, если чтение не удалось (например, миграция не применена). */
export async function loadMessages(db: Db, threadId: string, userId: string): Promise<{ messages: ChatLogMessage[]; truncated: boolean } | null> {
  const { data, error } = await db
    .from("chat_messages")
    .select("id,author_id,author_kind,body,created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: false })
    .limit(CHAT_PAGE_SIZE);
  if (error || !data) return null;
  const messages = data
    .map((m) => ({ id: m.id as string, kind: m.author_kind as ChatKind, mine: m.author_id === userId, body: m.body as string, at: m.created_at as string }))
    .reverse();
  return { messages, truncated: data.length === CHAT_PAGE_SIZE };
}
