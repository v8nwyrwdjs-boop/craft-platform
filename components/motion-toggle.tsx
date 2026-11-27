"use client";

import { setMotion, useMotion } from "@/lib/motion";

/** Footer switch for decorative motion. It is a real switch: keyboard operable, state announced. */
export function MotionToggle() {
  const on = useMotion();
  return (
    <button type="button" role="switch" aria-checked={on} className="f-switch" onClick={() => setMotion(!on)}>
      <span className="f-switch__track" aria-hidden="true">
        <span className="f-switch__thumb" />
      </span>
      <span>Движение на сайте</span>
    </button>
  );
}
