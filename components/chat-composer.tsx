"use client";

import { useActionState, useState } from "react";
import { sendChatMessage } from "@/app/actions/chat";
import { CHAT_BODY_MAX, chatErrorText, type SendState } from "@/lib/chat";

const initial: SendState = { sent: 0, error: "" };

export function ChatComposer({ threadId }: { threadId: string }) {
  const [state, action, pending] = useActionState(sendChatMessage, initial);
  const [text, setText] = useState("");
  const [seen, setSeen] = useState(0);
  // Черновик очищается только после успешной отправки; при ошибке текст остаётся.
  if (state.sent !== seen) {
    setSeen(state.sent);
    setText("");
  }
  const left = CHAT_BODY_MAX - text.length;

  return (
    <form action={action} className="f-chat__form">
      <input type="hidden" name="thread_id" value={threadId} />
      <div className="f-field">
        <label htmlFor="chat-body">Сообщение</label>
        <textarea
          id="chat-body"
          name="body"
          rows={3}
          maxLength={CHAT_BODY_MAX}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          aria-describedby="chat-hint chat-error"
          enterKeyHint="send"
          autoComplete="off"
          required
        />
      </div>
      <div className="f-chat__row">
        <p id="chat-hint" className="f-small f-muted">
          Только текст. Ctrl или ⌘ + Enter — отправить.{left < 500 ? ` Осталось ${left}.` : ""}
        </p>
        <button className="f-btn" type="submit" disabled={pending || !text.trim()}>
          {pending ? "Отправляем…" : "Отправить"}
        </button>
      </div>
      <p id="chat-error" className="f-small f-chat__error" role="alert">
        {state.error ? chatErrorText[state.error] : ""}
      </p>
    </form>
  );
}
