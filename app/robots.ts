import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";
  let sitemapUrl: string | undefined;

  if (isProduction && process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL);
      if (
        origin.protocol === "https:" &&
        !origin.username &&
        !origin.password &&
        origin.pathname === "/" &&
        !origin.search &&
        !origin.hash
      ) {
        sitemapUrl = new URL("/sitemap.xml", origin).toString();
      }
    } catch {
      // Invalid canonical URL: omit the sitemap reference until configuration is fixed.
    }
  }

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/directions", "/products", "/formats"],
      disallow: [
        "/admin",
        "/dashboard",
        "/learn",
        "/account",
        "/auth",
        "/login",
        "/register",
        "/forgot-password",
      ],
    },
    ...(sitemapUrl ? { sitemap: sitemapUrl } : {}),
  };
}
