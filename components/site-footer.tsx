import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return (
    <footer className="f-footer">
      <div className="f-wrap f-footer__grid">
        <div style={{ display: "grid", gap: "0.75rem", alignContent: "start" }}>
          <span className="f-brand">
            <BrandMark />
            <span>CRAFT</span>
          </span>
          <p className="f-small f-muted" style={{ maxWidth: "34em" }}>
            Цены на странице «Форматы» предварительные. CRAFT CLUB пока концепция, а не действующая услуга.
          </p>
        </div>
        <nav className="f-footer__links" aria-label="Разделы сайта">
          <Link href="/products">Каталог</Link>
          <Link href="/directions">Направления</Link>
          <Link href="/formats">Форматы</Link>
          <Link href="/login" prefetch={false}>Войти</Link>
          <Link href="/register" prefetch={false}>Регистрация</Link>
        </nav>
      </div>
    </footer>
  );
}
