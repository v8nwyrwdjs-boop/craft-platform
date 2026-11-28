"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markChatRead } from "@/app/actions/chat";
import { CHAT_POLL_MS } from "@/lib/chat";

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

/**
 * Обновление без постоянного соединения: раз в 20 секунд (в 3 раза реже при Save-Data), только пока вкладка видна и есть сеть,
 * и сразу при возвращении на вкладку. Каждый раз перечитываются данные страницы, черновик не теряется.
 */
export function ChatLive({ threadId, lastId }: { threadId: string; lastId: string | null }) {
  const router = useRouter();

  useEffect(() => {
    const saveData = (navigator as SaveDataNavigator).connection?.saveData === true;
    const refresh = () => {
      if (!document.hidden && navigator.onLine) router.refresh();
    };
    const timer = window.setInterval(refresh, saveData ? CHAT_POLL_MS * 3 : CHAT_POLL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);

  useEffect(() => {
    if (lastId) void markChatRead(threadId);
  }, [threadId, lastId]);

  return null;
}
