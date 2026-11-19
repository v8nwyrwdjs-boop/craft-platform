import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRAFT — Школа цифровых продуктов",
  description: "Не просто учись — создавай своё. Вместе с CRAFT пройди путь от идеи до собственного цифрового продукта.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}