import Link from "next/link";
import type { ReactNode } from "react";

export function ChatNotice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="f-section f-ground-paper" aria-labelledby="chat-title">
      <div className="f-wrap f-chat">
        <h1 id="chat-title" className="f-display f-h1 f-h1--page">
          {title}
        </h1>
        <p className="f-lead">{children}</p>
        <div className="f-actions">
          <Link className="f-btn f-btn--ghost" href="/dashboard">
            В кабинет
          </Link>
        </div>
      </div>
    </section>
  );
}
