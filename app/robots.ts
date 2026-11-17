import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const sitemapUrl =
    isProduction && configuredSiteUrl
      ? new URL("/sitemap.xml", configuredSiteUrl).toString()
      : undefined;

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
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
