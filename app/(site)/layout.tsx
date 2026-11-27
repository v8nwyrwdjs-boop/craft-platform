import { SiteBackdrop } from "@/components/site-backdrop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteMetadata, siteViewport } from "@/lib/site-metadata";
import "../v2.css";

export const metadata = siteMetadata;
export const viewport = siteViewport;

/** Root layout of the new design. Full page load when moving to or from the legacy pages keeps the two stylesheets apart. */
export default function SiteRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preload" href="/fonts/geologica-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/onest-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <SiteBackdrop />
        <a className="f-skip" href="#main">
          К содержимому
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
