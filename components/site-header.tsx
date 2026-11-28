"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AccountLink } from "./account-links";
import { LiquidLogo } from "./liquid-logo";

const links = [
  { href: "/products", label: "Каталог" },
  { href: "/directions", label: "Направления" },
  { href: "/formats", label: "Форматы" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  // The menu is open "for" one path; navigating anywhere closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenFor(null);
      button.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="f-header">
      <div className="f-wrap f-header__bar">
        <Link href="/" className="f-brand" aria-label="CRAFT, на главную">
          <LiquidLogo size={32} label="" fps={24} />
          <span>CRAFT</span>
        </Link>

        <nav className="f-nav" aria-label="Основная навигация">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(pathname, link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
          <AccountLink className="f-btn f-btn--ghost" />
        </nav>

        <button
          ref={button}
          type="button"
          className="f-menu-btn"
          aria-expanded={open}
          aria-controls="f-menu-panel"
          onClick={() => setOpenFor(open ? null : pathname)}
        >
          {open ? "Закрыть" : "Меню"}
        </button>
      </div>

      <div id="f-menu-panel" className="f-panel" hidden={!open}>
        <nav className="f-wrap" aria-label="Мобильная навигация">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(pathname, link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
          <AccountLink />
        </nav>
      </div>
    </header>
  );
}
