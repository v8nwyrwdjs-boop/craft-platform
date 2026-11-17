import type { MetadataRoute } from "next";

const publicPaths = ["/", "/directions", "/products", "/formats"];

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.VERCEL_ENV !== "production" || !process.env.NEXT_PUBLIC_SITE_URL) {
    return [];
  }

  let origin: URL;
  try {
    origin = new URL(process.env.NEXT_PUBLIC_SITE_URL);
  } catch {
    return [];
  }

  if (origin.protocol !== "https:" || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) {
    return [];
  }

  return publicPaths.map((path) => ({
    url: new URL(path, origin).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
