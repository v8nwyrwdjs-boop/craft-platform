export function getSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    let url: URL;
    try {
      url = new URL(configured);
    } catch {
      throw new Error("NEXT_PUBLIC_SITE_URL must be a valid HTTPS origin");
    }
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (
      (url.protocol !== "https:" && !isLocal) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error("NEXT_PUBLIC_SITE_URL must be a valid HTTPS origin");
    }
    return url.origin;
  }

  // Vercel provides a deployment-specific hostname. Never derive auth links
  // or post-auth redirects from untrusted Host / X-Forwarded-Host headers.
  const deploymentHost = process.env.VERCEL_URL;
  if (deploymentHost && /^[a-z0-9.-]+$/i.test(deploymentHost)) {
    return "https://" + deploymentHost;
  }

  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  throw new Error("Set NEXT_PUBLIC_SITE_URL or deploy on Vercel before using auth callbacks");
}
