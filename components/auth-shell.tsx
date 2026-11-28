import type { ReactNode } from "react";

type Notice = { tone: "good" | "bad"; text: string };

/** Каркас страниц входа и восстановления доступа: заголовок h1 передаёт сама страница. */
export function AuthShell({ heading, lead, notice, children, footer }: { heading: ReactNode; lead: string; notice?: Notice | null; children: ReactNode; footer: ReactNode }) {
  return (
    <section className="f-section f-ground-paper" aria-labelledby="auth-title">
      <div className="f-wrap f-auth">
        {heading}
        <p className="f-lead">{lead}</p>
        {notice && (
          <p className="f-note" data-tone={notice.tone} role={notice.tone === "bad" ? "alert" : "status"}>
            {notice.text}
          </p>
        )}
        {children}
        <div className="f-auth__foot">{footer}</div>
      </div>
    </section>
  );
}
