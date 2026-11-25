import Link from "next/link";
import { productsOfDirection, statusLabel, type Direction, type Product } from "@/lib/catalog";

/** Catalogue as a typeset list: the whole row is one link (stretched from the title). */
export function ProductRows({ items, level = 3 }: { items: Product[]; level?: 3 | 4 }) {
  const Heading = level === 4 ? "h4" : "h3";
  return (
    <ul className="f-index">
      {items.map((item) => (
        <li key={item.slug}>
          <Heading>
            <Link href={`/products/${item.slug}`}>{item.title}</Link>
          </Heading>
          <p className="f-index__result">{item.result}</p>
          <div className="f-index__side">
            <dl className="f-facts">
              <dt>Вход</dt>
              <dd>{item.entry}</dd>
              <dt>Срок</dt>
              <dd>{item.term}</dd>
              <dt>Инструменты</dt>
              <dd>{item.stack}</dd>
            </dl>
            <p className="f-status" data-s={item.status} style={{ marginTop: "0.75rem" }}>
              {statusLabel[item.status]}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DirectionRows({ items, level = 3 }: { items: Direction[]; level?: 3 | 4 }) {
  const Heading = level === 4 ? "h4" : "h3";
  return (
    <ul className="f-index">
      {items.map((item) => {
        const count = productsOfDirection(item.slug).filter((product) => product.status !== "idea").length;
        return (
          <li key={item.slug}>
            <Heading>
              <Link href={`/directions/${item.slug}`}>{item.title}</Link>
            </Heading>
            <p className="f-index__result">{item.project}</p>
            <div className="f-index__side">
              <dl className="f-facts">
                <dt>Вход</dt>
                <dd>{item.entry}</dd>
                <dt>Сложность</dt>
                <dd>{item.level}</dd>
                <dt>Срок</dt>
                <dd>{item.weeks}</dd>
                <dt>Продуктов</dt>
                <dd>{count}</dd>
              </dl>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
