export function safeInternalPath(value: string, fallback = "/dashboard") {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes(String.fromCharCode(92)) || Array.from(value).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return fallback;
  try {
    const target = new URL(value, "https://craft.invalid");
    if (target.origin !== "https://craft.invalid" || target.username || target.password) return fallback;
    const normalized = target.pathname + target.search + target.hash;
    // The URL parser resolves dot segments, so "/..//evil.example" (also with
    // %2e escapes) normalises to "//evil.example", which a browser reads as a
    // protocol-relative URL. Validate the normalised value again.
    if (!normalized.startsWith("/") || normalized.startsWith("//") || normalized.includes(String.fromCharCode(92))) return fallback;
    return normalized;
  } catch { return fallback; }
}
