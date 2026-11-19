import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./craft-theme.css";

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

export const metadata: Metadata = {
  metadataBase,
  title: { default: title, template: "%s | CRAFT" },
  description,
  applicationName: "CRAFT",
  category: "education",
  robots:
    process.env.VERCEL_ENV === "production"
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { type: "website", locale: "ru_RU", siteName: "CRAFT", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
