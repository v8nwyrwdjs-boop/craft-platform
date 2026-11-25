import type { Metadata } from "next";
import Link from "next/link";
import { DirectionRows } from "@/components/catalog-rows";
import { visibleDirections, visibleWorkshops } from "@/lib/catalog";
import { legacyTypes } from "@/lib/catalog-legacy";
import { plural } from "@/lib/ru";

export const metadata: Metadata = {
  title: "Направления",
  description: "Направления CRAFT: от сайтов и автоматизации до ИИ и данных. У каждого есть проект, с которого можно начать.",
};

export default function DirectionsPage() {
  const directionCount = visibleDirections.length;
  const workshopCount = visibleWorkshops.length;
  return (
    <>
      <section className="f-hero f-ground-void">
        <div className="f-wrap">
          <h1 className="f-display f-h1">Найдите своё направление</h1>
          <p className="f-lead">
            {directionCount} {plural(directionCount, "направление", "направления", "направлений")} в {workshopCount} {plural(workshopCount, "мастерской", "мастерских", "мастерских")}. Каждое ведёт к продукту из каталога.
          </p>
          <div className="f-actions">
            <Link className="f-btn f-btn--ghost" href="/products">
              Выбрать по результату
            </Link>
          </div>
        </div>
      </section>

      <section className="f-section f-ground-void" aria-label="Мастерские">
        <div className="f-wrap f-stack">
          {visibleWorkshops.map((workshop) => (
            <div key={workshop.slug} className="f-split">
              <div className="f-split__label">
                <h2 className="f-display f-h2">{workshop.title}</h2>
                <p className="f-small f-muted" style={{ marginTop: "0.75rem", maxWidth: "26em" }}>
                  {workshop.audience}
                </p>
              </div>
              <DirectionRows items={visibleDirections.filter((direction) => direction.workshop === workshop.slug)} />
            </div>
          ))}
        </div>
      </section>

      <section className="f-section f-ground-chalk" aria-labelledby="types-title">
        <div className="f-wrap f-split">
          <div className="f-split__label">
            <h2 id="types-title" className="f-display f-h2">
              Типы продуктов
            </h2>
            <p className="f-prose f-small" style={{ marginTop: "0.75rem" }}>
              Если вы начинаете не с темы, а с вида продукта: шесть типов с вопросами для исследования.
            </p>
          </div>
          <ul className="f-index">
            {legacyTypes.map((type) => (
              <li key={type.slug}>
                <h3>
                  <Link href={`/directions/${type.slug}`}>{type.title}</Link>
                </h3>
                <p className="f-index__result">{type.description}</p>
                <div className="f-index__side">
                  <p className="f-small f-muted">Сложность: {type.level}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
