import Link from "next/link";
import type { ReactNode } from "react";
import { setChatThreadStatus } from "@/app/actions/chat";
import { ChatComposer } from "./chat-composer";
import { ChatLive } from "./chat-live";
import { ChatLog, type ChatLogMessage } from "./chat-log";

type Props = {
  threadId: string;
  status: "open" | "closed";
  heading: ReactNode;
  lead: string;
  back: { href: string; label: string };
  messages: ChatLogMessage[];
  truncated: boolean;
  canManage: boolean;
  notice?: string;
};

export function ChatThread({ threadId, status, heading, lead, back, messages, truncated, canManage, notice }: Props) {
  const next = status === "open" ? "closed" : "open";
  return (
    <section className="f-section f-ground-paper" aria-labelledby="chat-title">
      <div className="f-wrap f-chat">
        <Link className="f-back" href={back.href}>
          ← {back.label}
        </Link>
        <header className="f-chat__head">
          {heading}
          <p className="f-lead">{lead}</p>
        </header>
        {notice && (
          <p className="f-note" data-tone="bad" role="alert">
            {notice}
          </p>
        )}
        <ChatLog messages={messages} truncated={truncated} />
        {status === "open" ? (
          <ChatComposer threadId={threadId} />
        ) : (
          <p className="f-note" data-tone="warn">
            Чат закрыт: писать в него пока нельзя. Прочитать переписку можно.
          </p>
        )}
        {canManage && (
          <form action={setChatThreadStatus} className="f-chat__manage">
            <input type="hidden" name="thread_id" value={threadId} />
            <input type="hidden" name="status" value={next} />
            <button className="f-btn f-btn--ghost" type="submit">
              {status === "open" ? "Закрыть чат" : "Открыть чат снова"}
            </button>
          </form>
        )}
        <ChatLive threadId={threadId} lastId={messages.length ? messages[messages.length - 1].id : null} />
      </div>
    </section>
  );
}
