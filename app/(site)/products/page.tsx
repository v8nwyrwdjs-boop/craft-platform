import type { Metadata } from "next";
import Link from "next/link";
import { ProductRows } from "@/components/catalog-rows";
import { visibleProducts, visibleWorkshops, workshopOfProduct } from "@/lib/catalog";
import { legacyConcepts } from "@/lib/catalog-legacy";
import { plural } from "@/lib/ru";

export const metadata: Metadata = {
  title: "Каталог продуктов",
  description: "Продукты, которые вы соберёте сами. У каждого указаны результат, срок, входной уровень и статус.",
};

export default function ProductsPage() {
  const open = visibleProducts.filter((item) => item.status === "open");
  const preparing = visibleProducts.filter((item) => item.status === "preparing");
  const groups = visibleWorkshops
    .map((workshop) => ({ workshop, items: preparing.filter((item) => workshopOfProduct(item)?.slug === workshop.slug) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <section className="f-hero f-ground-paper">
        <div className="f-wrap">
          <h1 className="f-display f-h1">Выберите, что соберёте</h1>
          <p className="f-lead">У каждого продукта есть результат, срок и входной уровень.</p>
          <p className="f-small f-muted">
            Сейчас {plural(open.length, "открыт", "открыто", "открыто")} {open.length} {plural(open.length, "продукт", "продукта", "продуктов")}, ещё {preparing.length} готовим.
          </p>
          <div className="f-actions">
            <Link className="f-btn f-btn--ghost" href="/directions">
              Выбрать по направлению
            </Link>
          </div>
        </div>
      </section>

      {open.length > 0 && (
        <section className="f-section f-ground-steel" aria-labelledby="open-title">
          <div className="f-wrap f-split">
            <h2 id="open-title" className="f-display f-h2">
              Открыт сейчас
            </h2>
            <ProductRows items={open} />
          </div>
        </section>
      )}

      <section className="f-section f-ground-paper" aria-labelledby="preparing-title">
        <div className="f-wrap f-stack">
          <div className="f-split">
            <h2 id="preparing-title" className="f-display f-h2">
              Готовим
            </h2>
            <p className="f-prose">Этих продуктов ещё нет в открытом доступе. Откройте продукт и встаньте в список ожидания: дат пока нет.</p>
          </div>
          {groups.map(({ workshop, items }) => (
            <div key={workshop.slug} className="f-split">
              <div className="f-split__label">
                <h3 className="f-display f-h3">{workshop.title}</h3>
                <p className="f-small f-muted" style={{ marginTop: "0.5rem", maxWidth: "26em" }}>
                  {workshop.audience}
                </p>
              </div>
              <ProductRows items={items} level={4} />
            </div>
          ))}
        </div>
      </section>

      <section className="f-section f-ground-chalk" aria-labelledby="ideas-title">
        <div className="f-wrap f-split">
          <div className="f-split__label">
            <h2 id="ideas-title" className="f-display f-h2">
              Идеи для проверки
            </h2>
            <p className="f-prose f-small" style={{ marginTop: "0.75rem" }}>
              Шесть демонстрационных бизнес-гипотез. Это примеры, на которых удобно учиться проверять спрос, а не прогноз дохода.
            </p>
          </div>
          <ul className="f-index">
            {legacyConcepts.map((concept) => (
              <li key={concept.id}>
                <h3>
                  <Link href={`/products/${concept.id}`}>{concept.title}</Link>
                </h3>
                <p className="f-index__result">{concept.problem}</p>
                <div className="f-index__side">
                  <p className="f-status">Демонстрационная бизнес-гипотеза</p>
                  <p className="f-small f-muted" style={{ marginTop: "0.35rem" }}>
                    Сложность: {concept.difficulty}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="f-section f-ground-ember" aria-labelledby="bridge-title">
        <div className="f-wrap f-split">
          <h2 id="bridge-title" className="f-display f-h2">
            Не нашли своё?
          </h2>
          <div style={{ display: "grid", gap: "1.25rem", justifyItems: "start" }}>
            <p className="f-lead">Посмотрите направления: у каждого есть проект, с которого можно начать.</p>
            <Link className="f-btn" href="/directions">
              Открыть направления
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
