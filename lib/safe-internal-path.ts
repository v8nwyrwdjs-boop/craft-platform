export function safeInternalPath(value: string, fallback = "/dashboard") {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes(String.fromCharCode(92)) || Array.from(value).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return fallback;
  try {
    const target = new URL(value, "https://craft.invalid");
    if (target.origin !== "https://craft.invalid" || target.username || target.password) return fallback;
    return target.pathname + target.search + target.hash;
  } catch { return fallback; }
}
