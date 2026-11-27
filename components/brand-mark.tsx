import { markArcPath, markGeometry } from "@/lib/brand-mark";

const { c, brick } = markGeometry;

/** Flat SVG version of the mark. The C follows the text colour, the brick is the heat accent. */
export function BrandMark({ title, size = 28 }: { title?: string; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d={markArcPath} fill="none" stroke="currentColor" strokeWidth={c.stroke} strokeLinecap="round" />
      <rect
        x={brick.cx - brick.w / 2}
        y={brick.cy - brick.h / 2}
        width={brick.w}
        height={brick.h}
        rx={brick.rx}
        fill="var(--heat)"
        transform={`rotate(${brick.rotDeg} ${brick.cx} ${brick.cy})`}
      />
    </svg>
  );
}
