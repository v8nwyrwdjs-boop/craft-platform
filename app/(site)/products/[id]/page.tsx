import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveCatalogProject } from "@/app/actions/projects";
import { ProductRows } from "@/components/catalog-rows";
import { WaitlistForm } from "@/components/waitlist-form";
import { directionBySlug, productBySlug, statusLabel, visibleProducts, workshopOfProduct, type Product } from "@/lib/catalog";
import { legacyConcepts, type LegacyConcept } from "@/lib/catalog-legacy";

type Params = Promise<{ id: string }>;

function resolve(id: string): { kind: "product"; product: Product } | { kind: "concept"; concept: LegacyConcept } | null {
  const product = productBySlug(id);
  if (product) return product.status === "idea" ? null : { kind: "product", product };
  const concept = legacyConcepts.find((item) => item.id === id.toUpperCase());
  return concept ? { kind: "concept", concept } : null;
}

export function generateStaticParams() {
  return [...visibleProducts.map((item) => ({ id: item.slug })), ...legacyConcepts.map((item) => ({ id: item.id }))];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const found = resolve((await params).id);
  if (!found) return { robots: { index: false, follow: false } };
  const title = found.kind === "product" ? found.product.title : found.concept.title;
  const description = found.kind === "product" ? (found.product.page?.lead ?? found.product.result) : found.concept.problem;
  return { title, description, openGraph: { title, description, type: "article" } };
}

export default async function ProductPage({ params }: { params: Params }) {
  const found = resolve((await params).id);
  if (!found) notFound();
  return found.kind === "product" ? <ProductView product={found.product} /> : <ConceptView concept={found.concept} />;
}

const pickVisible = (slugs: string[], exclude: string[]) =>
  slugs.filter((slug, index) => slugs.indexOf(slug) === index && !exclude.includes(slug)).map((slug) => productBySlug(slug)).filter((item): item is Product => Boolean(item) && item!.status !== "idea");

function ProductView({ product }: { product: Product }) {
  const direction = directionBySlug(product.direction);
  const workshop = workshopOfProduct(product);
  const page = product.page;
  const intent = product.status === "open" ? "access" : "waitlist";
  const notFor = page?.notForWhomSlug ? pickVisible([page.notForWhomSlug], [])[0] : undefined;
  const next = pickVisible(page?.next ?? [], [product.slug]);
  const nearby = pickVisible(
    [...(page?.related ?? []), ...visibleProducts.filter((item) => item.direction === product.direction).map((item) => item.slug)],
    [product.slug, ...next.map((item) => item.slug)],
  ).slice(0, 3);

  return (
    <article>
      <section className="f-hero f-ground-paper">
        <div className="f-wrap">
          <Link className="f-back" href="/products">
            К каталогу
          </Link>
          <h1 className="f-display f-h1 f-h1--page">{product.title}</h1>
          <p className="f-lead">{page?.lead ?? product.result}</p>
          <p className="f-statusline">
            <span className="f-status" data-s={product.status}>
              {statusLabel[product.status]}.
            </span>
            {product.status === "preparing" ? "Дату набора назовём, когда она станет известна." : "Запись идёт вручную: доступ открывает команда CRAFT."}
          </p>
          <dl className="f-facts">
            {workshop && (
              <>
                <dt>Мастерская</dt>
                <dd>{workshop.title}</dd>
              </>
            )}
            {direction && (
              <>
                <dt>Направление</dt>
                <dd>
                  <Link className="f-link" href={`/directions/${direction.slug}`}>
                    {direction.title}
                  </Link>
                </dd>
              </>
            )}
            <dt>Вход</dt>
            <dd>{product.entry}</dd>
            <dt>Срок</dt>
            <dd>{product.term}</dd>
            <dt>Инструменты</dt>
            <dd>{product.stack}</dd>
          </dl>
          <div className="f-only-wide">
            <div className="f-actions">
              <WaitlistForm product={product.slug} intent={intent} />
              {product.status === "open" && (
                <Link className="f-link" href="/learn" prefetch={false}>
                  Уже есть доступ? Открыть программу
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {page ? (
        <>
          <section className="f-section f-ground-chalk" aria-label="Для кого">
            <div className="f-wrap f-stack">
              <div className="f-split">
                <h2 className="f-display f-h2">Кому подходит</h2>
                <p className="f-prose">{page.forWhom}</p>
              </div>
              <div className="f-split">
                <h2 className="f-display f-h2">Кому не подходит</h2>
                <div className="f-prose">
                  <p>{page.notForWhom}</p>
                  {notFor && (
                    <p>
                      <Link className="f-link" href={`/products/${notFor.slug}`}>
                        {notFor.title}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="f-section f-ground-paper" aria-labelledby="hands-title">
            <div className="f-wrap f-split">
              <h2 id="hands-title" className="f-display f-h2">
                Что будет в руках
              </h2>
              <ul className="f-list f-list--big">
                {page.inHands.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {page.route && (
            <section className="f-section f-ground-chalk" aria-labelledby="route-title">
              <div className="f-wrap f-split">
                <h2 id="route-title" className="f-display f-h2">
                  Маршрут
                </h2>
                <ol className="f-steps">
                  {page.route.map((step) => (
                    <li key={step.stage}>
                      <strong>{step.stage}</strong>
                      <span>{step.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          <section className="f-section f-ground-paper" aria-labelledby="time-title">
            <div className="f-wrap f-split">
              <h2 id="time-title" className="f-display f-h2">
                Время и что понадобится
              </h2>
              <dl className="f-defs">
                <div>
                  <dt>Время</dt>
                  <dd>{page.time}</dd>
                </div>
                <div>
                  <dt>Что понадобится</dt>
                  <dd>{page.needs}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="f-section f-ground-steel" aria-labelledby="bounds-title">
            <div className="f-wrap f-split">
              <h2 id="bounds-title" className="f-display f-h2">
                Границы
              </h2>
              <p className="f-lead" style={{ color: "var(--fg)" }}>
                {page.boundaries}
              </p>
            </div>
          </section>

          {(page.done || page.missing) && (
            <section className="f-section f-ground-paper" aria-labelledby="ready-title">
              <div className="f-wrap f-split">
                <h2 id="ready-title" className="f-display f-h2">
                  Что готово и чего ещё нет
                </h2>
                <dl className="f-defs">
                  {page.done && (
                    <div>
                      <dt>Готово</dt>
                      <dd>
                        <ul className="f-list">
                          {page.done.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                  {page.missing && (
                    <div>
                      <dt>Ещё нет</dt>
                      <dd>
                        <ul className="f-list">
                          {page.missing.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>
          )}

          <section className="f-section f-ground-chalk" aria-labelledby="help-title">
            <div className="f-wrap f-split">
              <h2 id="help-title" className="f-display f-h2">
                Кто помогает
              </h2>
              <div className="f-prose">
                <p>{page.help}</p>
                {page.formatsNote && <p>{page.formatsNote}</p>}
                <p>
                  <Link className="f-link" href="/formats">
                    Форматы и предварительные цены
                  </Link>
                </p>
              </div>
            </div>
          </section>

          <section className="f-section f-ground-paper" aria-labelledby="faq-title">
            <div className="f-wrap f-split">
              <h2 id="faq-title" className="f-display f-h2">
                Вопросы
              </h2>
              <div className="f-faq">
                {page.faq.map((item) => (
                  <details key={item.q}>
                    <summary>{item.q}</summary>
                    <div>{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="f-section f-ground-chalk" aria-labelledby="now-title">
          <div className="f-wrap f-split">
            <h2 id="now-title" className="f-display f-h2">
              Что известно сейчас
            </h2>
            <div className="f-prose">
              <p>Подробная страница этого продукта ещё готовится. Пока известны результат, срок, входной уровень и инструменты: они указаны выше.</p>
              <p>Остальное опубликуем, когда материалы будут готовы.</p>
            </div>
          </div>
        </section>
      )}

      {next.length > 0 && (
        <section className="f-section f-ground-paper" aria-labelledby="next-title">
          <div className="f-wrap f-split">
            <h2 id="next-title" className="f-display f-h2">
              Что дальше
            </h2>
            <ProductRows items={next} />
          </div>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="f-section f-ground-paper" aria-labelledby="nearby-title">
          <div className="f-wrap f-split">
            <h2 id="nearby-title" className="f-display f-h2">
              Рядом
            </h2>
            <ProductRows items={nearby} />
          </div>
        </section>
      )}

      <section className="f-section f-ground-ember f-only-wide" aria-labelledby="join-title">
        <div className="f-wrap f-split">
          <h2 id="join-title" className="f-display f-h2">
            {product.status === "open" ? "Записаться" : "Встать в очередь"}
          </h2>
          <div style={{ display: "grid", gap: "1rem", justifyItems: "start" }}>
            <p className="f-lead">Платежей на сайте пока нет: запись ничего не списывает.</p>
            <WaitlistForm product={product.slug} intent={intent} />
          </div>
        </div>
      </section>

      <div className="f-actionbar">
        <WaitlistForm product={product.slug} intent={intent} />
      </div>
    </article>
  );
}

function ConceptView({ concept }: { concept: LegacyConcept }) {
  const blocks = [
    { title: "Для кого", text: concept.audience },
    { title: "Возможная монетизация", text: concept.revenue },
    { title: "Первый MVP", text: concept.mvp },
    { title: "Как проверять", text: concept.validation },
  ];
  return (
    <article>
      <section className="f-hero f-ground-paper">
        <div className="f-wrap">
          <Link className="f-back" href="/products">
            К каталогу
          </Link>
          <h1 className="f-display f-h1 f-h1--page">{concept.title}</h1>
          <p className="f-lead">{concept.problem}</p>
          <p className="f-statusline">
            <span className="f-status">Демонстрационная бизнес-гипотеза.</span>
            Сложность: {concept.difficulty}. Это пример для тренировки проверки спроса, а не прогноз дохода.
          </p>
        </div>
      </section>

      <section className="f-section f-ground-chalk">
        <div className="f-wrap f-stack">
          {blocks.map((block) => (
            <div key={block.title} className="f-split">
              <h2 className="f-display f-h2">{block.title}</h2>
              <p className="f-prose">{block.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="f-section f-ground-ember" aria-labelledby="adapt-title">
        <div className="f-wrap f-split">
          <h2 id="adapt-title" className="f-display f-h2">
            Адаптируйте под свою аудиторию
          </h2>
          <form action={saveCatalogProject} style={{ display: "grid", gap: "1.25rem", justifyItems: "start" }}>
            <p className="f-lead">Сохраните гипотезу в кабинете и доработайте её под людей, для которых вы делаете продукт.</p>
            <input type="hidden" name="return_to" value={`/products/${concept.id}`} />
            <input type="hidden" name="origin_type" value="concept" />
            <input type="hidden" name="origin_slug" value={concept.id} />
            <input type="hidden" name="title" value={concept.title} />
            <button className="f-btn" type="submit">
              Добавить в мои проекты
            </button>
          </form>
        </div>
      </section>
    </article>
  );
}
