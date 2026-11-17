import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRAFT — Создавай цифровые продукты",
  description: "От идеи до собственного цифрового продукта. Изучай технологии, создавай проекты и получай живую обратную связь с CRAFT.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}