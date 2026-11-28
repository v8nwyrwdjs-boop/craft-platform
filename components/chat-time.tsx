"use client";

import { useSyncExternalStore } from "react";
import { chatStamp } from "@/lib/chat";

const subscribe = () => () => {};

/** Время в часовом поясе читателя: на сервере пусто, после гидрации — локальное, без расхождений разметки. */
export function ChatTime({ iso }: { iso: string }) {
  const text = useSyncExternalStore(subscribe, () => chatStamp(iso), () => "");
  return <time dateTime={iso}>{text}</time>;
}
