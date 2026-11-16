import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRAFT — Digital Product School",
  description: "Выбери направление или бизнес-концепцию. Создай цифровой продукт с поддержкой CRAFT и наставника.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}