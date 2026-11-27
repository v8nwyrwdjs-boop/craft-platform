import type { Metadata, Viewport } from "next";

const title = "CRAFT — школа создания цифровых продуктов";
const description =
  "От идеи до собственного цифрового продукта. Изучай технологии, проверяй спрос, создавай проекты и получай живую обратную связь с CRAFT.";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const metadataBase = (() => {
  if (!configuredSiteUrl) return undefined;
  try {
    const url = new URL(configuredSiteUrl);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
      return undefined;
    }
    return url;
  } catch {
    return undefined;
  }
})();

/** Shared by every root layout, so the two "worlds" (site and legacy) describe CRAFT the same way. */
export const siteMetadata: Metadata = {
  metadataBase,
  title: { default: title, template: "%s | CRAFT" },
  description,
  applicationName: "CRAFT",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  category: "education",
  robots:
    process.env.VERCEL_ENV === "production"
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { type: "website", locale: "ru_RU", siteName: "CRAFT", title, description },
  twitter: { card: "summary_large_image", title, description },
};

/** sRGB of --ground-paper oklch(0.995 0.002 250): the colour of the browser chrome on the white site. */
export const siteViewport: Viewport = {
  themeColor: "#fcfdff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/** The first design (auth, dashboard, learning) is still dark until it is ported. */
export const legacyViewport: Viewport = {
  themeColor: "#080a10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};
