import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveCatalogProject } from "@/app/actions/projects";
import { DirectionRows, ProductRows } from "@/components/catalog-rows";
import { directionBySlug, legacyTypeNearest, visibleDirections, visibleProductsOfDirection, workshopBySlug, type Direction } from "@/lib/catalog";
import { legacyTypes, type LegacyType } from "@/lib/catalog-legacy";

type Params = Promise<{ slug: string }>;

function resolve(slug: string): { kind: "direction"; direction: Direction } | { kind: "type"; type: LegacyType } | null {
  const direction = directionBySlug(slug);
  if (direction) return visibleDirections.includes(direction) ? { kind: "direction", direction } : null;
  const type = legacyTypes.find((item) => item.slug === slug);
  return type ? { kind: "type", type } : null;
}

export function generateStaticParams() {
  return [...visibleDirections.map((item) => ({ slug: item.slug })), ...legacyTypes.map((item) => ({ slug: item.slug }))];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const found = resolve((await params).slug);
  if (!found) return { robots: { index: false, follow: false } };
  const title = found.kind === "direction" ? found.direction.title : found.type.title;
  const description = found.kind === "direction" ? found.direction.project : found.type.description;
  return { title, description, openGraph: { title, description, type: "article" } };
}

export default async function DirectionPage({ params }: { params: Params }) {
  const found = resolve((await params).slug);
  if (!found) notFound();
  return found.kind === "direction" ? <DirectionView direction={found.direction} /> : <TypeView type={found.type} />;
}

function DirectionView({ direction }: { direction: Direction }) {
  const workshop = workshopBySlug(direction.workshop);
  const products = visibleProductsOfDirection(direction.slug);
  const siblings = visibleDirections.filter((item) => item.workshop === direction.workshop && item.slug !== direction.slug).slice(0, 3);
  return (
    <article>
      <section className="f-hero f-ground-paper">
        <div className="f-wrap">
          <Link className="f-back" href="/directions">
            Все направления
          </Link>
          <h1 className="f-display f-h1 f-h1--page">{direction.title}</h1>
          <p className="f-lead">{direction.project}</p>
          <dl className="f-facts">
            {workshop && (
              <>
                <dt>Мастерская</dt>
                <dd>{workshop.title}</dd>
              </>
            )}
            <dt>Вход</dt>
            <dd>{direction.entry}</dd>
            <dt>Сложность</dt>
            <dd>{direction.level}</dd>
            <dt>Срок</dt>
            <dd>{direction.weeks}</dd>
            <dt>Инструменты</dt>
            <dd>{direction.stack}</dd>
          </dl>
        </div>
      </section>

      <section className="f-section f-ground-chalk" aria-labelledby="products-title">
        <div className="f-wrap f-split">
          <h2 id="products-title" className="f-display f-h2">
            Продукты направления
          </h2>
          <ProductRows items={products} />
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="f-section f-ground-paper" aria-labelledby="siblings-title">
          <div className="f-wrap f-split">
            <h2 id="siblings-title" className="f-display f-h2">
              В этой мастерской
            </h2>
            <DirectionRows items={siblings} />
          </div>
        </section>
      )}
    </article>
  );
}

function TypeView({ type }: { type: LegacyType }) {
  const nearest = (legacyTypeNearest[type.slug] ?? []).map((slug) => directionBySlug(slug)).filter((item): item is Direction => Boolean(item) && visibleDirections.includes(item!));
  return (
    <article>
      <section className="f-hero f-ground-paper">
        <div className="f-wrap">
          <Link className="f-back" href="/directions">
            Все направления
          </Link>
          <h1 className="f-display f-h1 f-h1--page">{type.title}</h1>
          <p className="f-lead">{type.description}</p>
          <p className="f-statusline">
            <span className="f-status">Тип продукта.</span>
            Возможная монетизация: {type.models}. Сложность: {type.level}.
          </p>
        </div>
      </section>

      <section className="f-section f-ground-chalk">
        <div className="f-wrap f-stack">
          <div className="f-split">
            <h2 className="f-display f-h2">Примеры продуктов</h2>
            <p className="f-prose">{type.examples}</p>
          </div>
          <div className="f-split">
            <h2 className="f-display f-h2">Вопросы для исследования</h2>
            <ul className="f-list f-list--big">
              {type.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {nearest.length > 0 && (
        <section className="f-section f-ground-paper" aria-labelledby="near-title">
          <div className="f-wrap f-split">
            <h2 id="near-title" className="f-display f-h2">
              Ближайшие направления каталога
            </h2>
            <DirectionRows items={nearest} />
          </div>
        </section>
      )}

      <section className="f-section f-ground-ember" aria-labelledby="idea-title">
        <div className="f-wrap f-split">
          <h2 id="idea-title" className="f-display f-h2">
            Превратите тип в идею
          </h2>
          <form action={saveCatalogProject} style={{ display: "grid", gap: "1.25rem", justifyItems: "start" }}>
            <p className="f-lead">Сохраните тип продукта в кабинете и сформулируйте на его основе свою идею.</p>
            <input type="hidden" name="return_to" value={`/directions/${type.slug}`} />
            <input type="hidden" name="origin_type" value="direction" />
            <input type="hidden" name="origin_slug" value={type.slug} />
            <input type="hidden" name="title" value={type.title} />
            <button className="f-btn" type="submit">
              Добавить в мои проекты
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
