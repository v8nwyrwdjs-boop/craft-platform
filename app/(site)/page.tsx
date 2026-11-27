import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { BrickScene } from "@/components/brick-scene";
import { ProductRows } from "@/components/catalog-rows";
import { visibleProducts } from "@/lib/catalog";

const stages = [
  ["Идея", "страница о том, кому и зачем"],
  ["Исследование", "что уже есть и чем ваше отличается, вашими словами"],
  ["Проверка", "разговоры с живыми людьми и записанные выводы"],
  ["Бизнес-модель", "расчёт на ваших цифрах"],
  ["Рабочая версия", "то, что можно запустить"],
  ["Запуск", "публикация и неделя наблюдения"],
] as const;

const help = [
  ["Напарник", "Помощник в проекте: предлагает следующий шаг, разбирает ошибку, проверяет по критериям. Проект за вас не пишет. Пока готовим."],
  ["Наставник", "Человек, который смотрит ваши решения и говорит, что исправить. Часы названы заранее."],
  ["Команда CRAFT", "Если нужен готовый продукт: оценка по описанию, исходный код и инструкции остаются у вас."],
] as const;

/** Seven chapters, one persistent 3D object behind them (components/brick-scene.tsx). Copy: concept document, section 15 and 17. */
export default function Home() {
  return (
    <>
      <BrickScene />

      <section className="f-chapter f-ground-paper" data-chapter aria-labelledby="home-title">
        <div className="f-chapter__art" aria-hidden="true">
          <BrandMark size={440} />
        </div>
        <div className="f-wrap">
          <div className="f-chapter__body">
            <h1 id="home-title" className="f-display f-h1">
              Соберите собственный цифровой продукт
            </h1>
            <p className="f-lead">Шесть этапов — от идеи до запуска. Рядом Напарник, наставник и команда, столько, сколько нужно вам.</p>
            <div className="f-actions">
              <Link className="f-btn" href="/products/craft-foundation">
                Начать первый день
              </Link>
              <Link className="f-btn f-btn--ghost" href="/products">
                Выбрать, что собрать
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="f-chapter f-ground-steel" data-chapter aria-labelledby="home-project">
        <div className="f-wrap">
          <div className="f-chapter__body">
            <h2 id="home-project" className="f-display f-h2">
              Ваш проект в центре
            </h2>
            <p className="f-lead">
              Вы приходите с идеей. Маршрут заканчивается тем, что можно открыть, запустить и показать: сайт, бот, сервис, сцена, прототип. Уроки нужны для следующего шага, больше они ничего не делают.
            </p>
          </div>
        </div>
      </section>

      <section className="f-chapter f-ground-paper" data-chapter aria-labelledby="home-stages">
        <div className="f-wrap">
          <div className="f-chapter__body">
            <h2 id="home-stages" className="f-display f-h2">
              Шесть этапов, шесть результатов
            </h2>
            <ul className="f-steps">
              {stages.map(([name, result]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{result}</span>
                </li>
              ))}
            </ul>
            <p className="f-muted f-small">Сегодня открыта программа до плана рабочей версии, остальное готовим.</p>
            <Link className="f-link" href="/products/craft-foundation">
              Открыть программу
            </Link>
          </div>
        </div>
      </section>

      <section className="f-chapter f-ground-chalk" data-chapter aria-labelledby="home-products">
        <div className="f-wrap">
          <div className="f-chapter__body f-chapter__body--wide">
            <h2 id="home-products" className="f-display f-h2">
              Что можно собрать
            </h2>
            <p className="f-lead">Каждый продукт назван результатом. Открыт пока один: довести идею до проверенного плана. Остальные готовим. Платежей на сайте пока нет.</p>
            <ProductRows items={visibleProducts.slice(0, 6)} />
            <Link className="f-link" href="/products">
              Все продукты
            </Link>
          </div>
        </div>
      </section>

      <section className="f-chapter f-ground-steel" data-chapter aria-labelledby="home-help">
        <div className="f-wrap">
          <div className="f-chapter__body">
            <h2 id="home-help" className="f-display f-h2">
              Рядом — три вида помощи
            </h2>
            <ul className="f-steps">
              {help.map(([name, text]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <Link className="f-link" href="/formats">
              Форматы
            </Link>
          </div>
        </div>
      </section>

      <section className="f-chapter f-ground-paper" data-chapter aria-labelledby="home-today">
        <div className="f-wrap">
          <div className="f-chapter__body">
            <h2 id="home-today" className="f-display f-h2">
              Честно о сегодняшнем дне
            </h2>
            <dl className="f-defs">
              <div>
                <dt>Есть сегодня</dt>
                <dd>Сайт с каталогом продуктов и направлений, регистрация и личный кабинет, программа «Довести идею до проверенного плана».</dd>
              </div>
              <div>
                <dt>Готовим</dt>
                <dd>Остальные продукты каталога, Напарник, оплата.</dd>
              </div>
              <div>
                <dt>Не обещаем</dt>
                <dd>Дохода, сроков «за 30 дней», трудоустройства, результата без вашей работы.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="f-chapter f-chapter--tall f-ground-ember" data-chapter aria-labelledby="home-start">
        <div className="f-wrap">
          <div className="f-chapter__body">
            <h2 id="home-start" className="f-display f-h2">
              Первый шаг бесплатный
            </h2>
            <p className="f-lead">Один день, одна задача, карточка вашего проекта. Платежей на сайте пока нет, карта не нужна.</p>
            <div className="f-actions">
              <Link className="f-btn" href="/products/craft-foundation">
                Начать первый день
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
