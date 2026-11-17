import type { MetadataRoute } from "next";

const publicPaths = [
  "/",
  "/directions",
  ...Array.from({ length: 6 }, (_, index) => `/directions/direction-${String(index + 1).padStart(2, "0")}`),
  "/products",
  ...Array.from({ length: 6 }, (_, index) => `/products/C-${String(index + 1).padStart(2, "0")}`),
  "/formats",
];

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
    changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
    priority: path === "/" ? 1 : path === "/directions" || path === "/products" ? 0.8 : 0.6,
  }));
}
