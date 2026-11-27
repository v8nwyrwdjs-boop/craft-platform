/** Shared, mutable and tiny: scroll position as chapter progress and the pointer, written by the page, read by the 3D frame loop. */
export const progress = { t: 0, px: 0, py: 0, busy: true, wake: () => {} };

export function nudge() {
  progress.busy = true;
  progress.wake();
}
