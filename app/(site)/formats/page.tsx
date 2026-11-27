import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Форматы",
  description: "Пять форматов: от самостоятельной работы до разработки командой CRAFT. Цены предварительные, платежей на сайте пока нет.",
};

type Format = {
  slug: string;
  name: string;
  state: "price" | "preparing";
  /** Planning figure from the owner; shown only with the "preliminary" qualification. */
  anchor?: string;
  summary: string;
  who: string;
  included: string[];
  excluded: string[];
  limits: string;
};

const formats: Format[] = [
  {
    slug: "self",
    name: "Своими руками",
    state: "price",
    anchor: "около 2 000 ₽ за программу",
    summary: "Самостоятельная работа по маршруту.",
    who: "Привыкли работать сами, нужны маршрут и критерии.",
    included: ["Структурированные уроки и последовательный маршрут", "Пошаговые инструкции и практические задания", "Шаблоны, чек-листы и примеры", "Материалы для самостоятельной проверки результата"],
    excluded: ["Проверка наставником", "Помощник с моделью", "Созвоны"],
    limits: "Срок доступа к материалам пока не определён.",
  },
  {
    slug: "partner",
    name: "С Напарником",
    state: "preparing",
    summary: "Маршрут и персональный помощник по вашему проекту.",
    who: "Нужен постоянный собеседник по проекту, но не нужна живая проверка.",
    included: ["Всё из формата «Своими руками»", "Помощник, который знает контекст вашего проекта", "Предпроверка работ перед сдачей"],
    excluded: ["Живой человек: разбор делает помощник, не наставник"],
    limits: "Суточный лимит сообщений.",
  },
  {
    slug: "mentor",
    name: "С наставником",
    state: "price",
    anchor: "около 10 000 ₽ за программу",
    summary: "Маршрут и разборы живого человека.",
    who: "Важны живые решения и обратная связь по собственной работе.",
    included: ["Всё из формата «Своими руками»", "Разбор ваших решений и вопросов", "Помощь с инструментами и исправлением ошибок", "Обратная связь по этапам проекта"],
    excluded: ["Работа вместо автора", "Гарантии коммерческого результата"],
    limits: "Часы наставника ограничены на программу; число будет указано на странице продукта. Объём встреч, способ связи и сроки обратной связи будут зафиксированы до открытия продаж.",
  },
  {
    slug: "launch",
    name: "До запуска",
    state: "preparing",
    summary: "Интенсивное сопровождение до публичного запуска проекта.",
    who: "Есть проект, который нужно довести до публичного запуска.",
    included: ["Всё из формата «С наставником»", "План запуска", "Архитектурный разбор", "Проверка безопасности и доступности", "Финальный разбор", "Помощь с публикацией"],
    excluded: ["Разработка за автора"],
    limits: "Больше часов наставника, один архитектурный и один финальный разбор.",
  },
  {
    slug: "team",
    name: "Команда CRAFT",
    state: "price",
    anchor: "от 40 000 ₽ за проект",
    summary: "Разработка и передача готового продукта. Это сервис разработки, а не обучение.",
    who: "Нужен результат, а не процесс. Подходит и бизнесу.",
    included: ["Обсуждение задачи, требований и ожидаемого результата", "Согласование состава работ, этапов и сроков", "Разработка и проверка решения силами CRAFT", "Передача готового проекта, исходного кода, документации и инструкций"],
    excluded: ["Обучение", "Поддержка после передачи: только по отдельному соглашению"],
    limits: "Объём задаёт смета. Итоговая стоимость зависит от объёма и сложности; сторонние сервисы, инфраструктура, права на отдельные компоненты и число правок согласуются отдельно.",
  },
];

export default function FormatsPage() {
  return (
    <>
      <section className="f-hero f-ground-paper">
        <div className="f-wrap">
          <h1 className="f-display f-h1">Форматы работы</h1>
          <p className="f-lead">Проект проходит одни и те же этапы. Форматы различаются глубиной поддержки.</p>
          <p className="f-note" data-tone="warn">
            Суммы на этой странице предварительные: это ориентиры для планирования, а не условия оферты. Платежей на сайте пока нет.
          </p>
        </div>
      </section>

      <section className="f-section f-ground-chalk" aria-label="Форматы">
        <div className="f-wrap f-stack">
          {formats.map((format) => (
            <div key={format.slug} className="f-split">
              <div className="f-split__label">
                <h2 className="f-display f-h2">{format.name}</h2>
                <p className="f-lead" style={{ marginTop: "0.75rem", color: "var(--fg)" }}>
                  {format.state === "price" ? format.anchor : "Готовим"}
                </p>
                <p className="f-small f-muted" style={{ marginTop: "0.35rem", maxWidth: "24em" }}>
                  {format.state === "price" ? "Предварительный ориентир." : "Цены пока нет: её назовём, когда формат будет готов."}
                </p>
              </div>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                <p className="f-prose">{format.summary}</p>
                <dl className="f-defs">
                  <div>
                    <dt>Для кого</dt>
                    <dd>{format.who}</dd>
                  </div>
                  <div>
                    <dt>Что входит</dt>
                    <dd>
                      <ul className="f-list">
                        {format.included.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>Что не входит</dt>
                    <dd>
                      <ul className="f-list">
                        {format.excluded.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>Лимиты</dt>
                    <dd>{format.limits}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="f-section f-ground-steel" aria-labelledby="club-title">
        <div className="f-wrap f-split">
          <div className="f-split__label">
            <h2 id="club-title" className="f-display f-h2">
              CRAFT CLUB
            </h2>
            <p className="f-lead" style={{ marginTop: "0.75rem", color: "var(--fg)" }}>
              Концепт
            </p>
            <p className="f-small f-muted" style={{ marginTop: "0.35rem", maxWidth: "24em" }}>
              Ориентир около 990 ₽ в месяц. Услуга пока не подтверждена и не продаётся.
            </p>
          </div>
          <div className="f-prose">
            <p>Сообщество, к которому можно присоединиться к любому формату: закрытый чат участников, воркшопы, библиотека шаблонов, групповые часы вопросов, скидки и ранний доступ к новым направлениям.</p>
            <p>Состав не утверждён. Клуб не заменяет наставника и не включает индивидуальную разработку проекта.</p>
          </div>
        </div>
      </section>

      <section className="f-section f-ground-paper" aria-labelledby="rules-title">
        <div className="f-wrap f-split">
          <h2 id="rules-title" className="f-display f-h2">
            Правила для всех форматов
          </h2>
          <ul className="f-list f-list--big">
            <li>Ни один формат не обещает доход, трудоустройство или коммерческий успех продукта.</li>
            <li>Сроки ответа наставника не называются, пока их не утвердит владелец.</li>
            <li>Что включено и чего нет, видно на странице продукта до кнопки действия.</li>
            <li>Пока платежей нет, кнопка на странице продукта называется «Записаться в список».</li>
          </ul>
        </div>
      </section>

      <section className="f-section f-ground-ember" aria-labelledby="go-title">
        <div className="f-wrap f-split">
          <h2 id="go-title" className="f-display f-h2">
            Выберите продукт
          </h2>
          <div style={{ display: "grid", gap: "1.25rem", justifyItems: "start" }}>
            <p className="f-lead">Формат выбирают внутри продукта: там указано, что входит и сколько часов наставника.</p>
            <Link className="f-btn" href="/products">
              Открыть каталог
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
