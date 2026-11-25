/** Placeholder mark: a hexagonal brick with a C cut into it. The liquid-metal logo replaces it later. */
export function BrandMark({ title }: { title?: string }) {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d="M16 1.5 28.56 8.75v14.5L16 30.5 3.44 23.25V8.75Z" fill="var(--heat)" />
      <path d="M20.6 11.4A6.5 6.5 0 1 0 20.6 20.6" fill="none" stroke="var(--on-heat)" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}
