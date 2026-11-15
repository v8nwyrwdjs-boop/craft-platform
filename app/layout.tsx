import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRAFT — Digital Product School",
  description: "Практическая школа создания цифровых продуктов: от идеи и проверки спроса до запуска и первых пользователей.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}