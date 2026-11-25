import { siteMetadata, siteViewport } from "@/lib/site-metadata";
import "../globals.css";
import "../craft-theme.css";

export const metadata = siteMetadata;
export const viewport = siteViewport;

/** Root layout of the pages that still use the first design (auth, dashboard, learning, admin). */
export default function LegacyRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
