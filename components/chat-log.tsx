"use client";

import { useEffect, useRef } from "react";
import type { ChatKind } from "@/lib/chat";
import { ChatTime } from "./chat-time";

export type ChatLogMessage = { id: string; kind: ChatKind; mine: boolean; body: string; at: string };

const who = (m: ChatLogMessage) => (m.mine ? "Вы" : m.kind === "staff" ? "Команда CRAFT" : "Ученик");

/** Лента сообщений: обычный текст, прокрутка вниз только если читатель и так был внизу. */
export function ChatLog({ messages, truncated }: { messages: ChatLogMessage[]; truncated: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const lastId = messages.length ? messages[messages.length - 1].id : null;

  useEffect(() => {
    const el = box.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [lastId]);

  return (
    <div
      ref={box}
      className="f-chat__log"
      role="log"
      aria-label="Сообщения"
      tabIndex={0}
      onScroll={(event) => {
        const el = event.currentTarget;
        stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      }}
    >
      {truncated && <p className="f-small f-muted">Показаны последние сообщения, более ранние скрыты.</p>}
      {messages.length === 0 ? (
        <p className="f-chat__empty">Сообщений пока нет. Напишите первым.</p>
      ) : (
        <ol className="f-chat__list">
          {messages.map((m) => (
            <li key={m.id} className="f-chat__item" data-own={m.mine}>
              <p className="f-chat__meta">
                {who(m)} · <ChatTime iso={m.at} />
              </p>
              <p className="f-chat__bubble">{m.body}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
