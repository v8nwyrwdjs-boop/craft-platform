"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";
import { waitlistLabel, waitlistMessage, type WaitlistIntent, type WaitlistState } from "@/lib/waitlist";

const initial: WaitlistState = { status: "idle" };

export function WaitlistForm({ product, intent }: { product: string; intent: WaitlistIntent }) {
  const [state, action, pending] = useActionState(joinWaitlist, initial);
  const tone = state.status === "idle" ? undefined : state.status === "ok" || state.status === "already" ? "good" : "bad";
  return (
    <form action={action} className="f-waitlist">
      <input type="hidden" name="product" value={product} />
      <button className="f-btn" type="submit" disabled={pending}>
        {pending ? "Записываем…" : waitlistLabel[intent]}
      </button>
      <p className="f-small f-waitlist__msg" role="status" data-tone={tone}>
        {waitlistMessage(intent, state.status)}
      </p>
    </form>
  );
}
