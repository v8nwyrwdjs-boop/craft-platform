"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const SESSION_COOKIE = /(?:^|;\s*)sb-[^=;]+-auth-token(?:\.\d+)?=/;
const never = () => () => {};

/** Есть ли в браузере cookie сессии. Это подсказка для подписи ссылки; доступ к страницам проверяет сервер. */
function useHasSession() {
  return useSyncExternalStore(never, () => SESSION_COOKIE.test(document.cookie), () => false);
}

/** «Войти» или «Кабинет». Сервер всегда отдаёт «Войти», поэтому публичные страницы остаются статическими. */
export function AccountLink({ className }: { className?: string }) {
  const signedIn = useHasSession();
  return (
    <Link href={signedIn ? "/dashboard" : "/login"} prefetch={false} className={className}>
      {signedIn ? "Кабинет" : "Войти"}
    </Link>
  );
}

/** «Регистрация» скрывается, когда сессия уже есть. */
export function RegisterLink() {
  const signedIn = useHasSession();
  if (signedIn) return null;
  return (
    <Link href="/register" prefetch={false}>
      Регистрация
    </Link>
  );
}
