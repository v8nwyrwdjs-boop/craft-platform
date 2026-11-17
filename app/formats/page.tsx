import Link from "next/link";

const formats = [
  {
    id: "self-study",
    number: "01",
    name: "Самостоятельно",
    price: "2 000 ₽",
    cadence: "за программу",
    intro: "Для тех, кто хочет изучить тему в своём темпе и самостоятельно собрать первый результат.",
    includes: ["Структурированные уроки и последовательный маршрут", "Пошаговые инструкции и практические задания", "Шаблоны, чек-листы и примеры", "Материалы для самостоятельной проверки результата"],
    note: "Персональное сопровождение наставника в этот формат не входит."
  },
  {
    id: "mentorship",
    number: "02",
    name: "С наставником",
    price: "10 000 ₽",
    cadence: "за программу",
    intro: "Для тех, кому важно не просто изучить материал, а получать человеческую обратную связь по собственной работе.",
    includes: ["Всё, что входит в самостоятельный формат", "Разбор твоих решений и вопросов", "Помощь с инструментами и исправлением ошибок", "Обратная связь по этапам проекта", "Поддержка в движении к рабочему результату"],
    note: "Конкретный объём встреч, формат связи и сроки обратной связи будут зафиксированы в описании программы до открытия продаж.",
    featured: true
  },
  {
    id: "done-for-you",
    number: "03",
    name: "Разработка под ключ",
    price: "от 40 000 ₽",
    cadence: "за проект",
    intro: "Это не обучение. Ты описываешь задачу, а CRAFT самостоятельно проектирует и разрабатывает согласованное цифровое решение.",
    includes: ["Обсуждение задачи, требований и ожидаемого результата", "Согласование состава работ, этапов и сроков", "Разработка и проверка решения силами CRAFT", "Передача готового проекта и исходного кода", "Документация и инструкции по переносу на инфраструктуру заказчика"],
    note: "Итоговая стоимость зависит от объёма и сложности. Сторонние сервисы, инфраструктура, поддержка после передачи, права на отдельные компоненты и количество правок согласуются отдельно."
  },
  {
    id: "club",
    number: "04",
    name: "CRAFT CLUB",
    price: "990 ₽",
    cadence: "в месяц",
    intro: "Сообщество для тех, кто хочет оставаться в движении, обмениваться опытом и регулярно пробовать новые инструменты.",
    includes: ["Закрытое сообщество участников", "Ежемесячные практические воркшопы", "Библиотека шаблонов, инструкций и разборов", "Групповые часы вопросов и ответов", "Специальные условия на программы и мероприятия", "Ранний доступ к новым направлениям"],
    note: "Клуб не заменяет персональное наставничество и не включает индивидуальную разработку проекта."
  }
];

export default function FormatsPage() {
  return (
    <main className="formats-page">
      <header className="header wrap">
        <Link className="brand" href="/">CRAFT<span>®</span></Link>
        <nav aria-label="Основная навигация">
          <Link href="/#products">Что создадим</Link>
          <Link href="/directions">Направления</Link>
          <Link href="/#method">Метод CRAFT</Link>
        </nav>
        <div className="header-account"><Link href="/login">Войти</Link><Link className="header-cta" href="/register">Присоединиться <span>↗</span></Link></div>
      </header>

      <section className="formats-hero wrap">
        <p className="eyebrow"><i /> CRAFT / ФОРМАТЫ УЧАСТИЯ</p>
        <p className="catalog-kicker">СНАЧАЛА — ЦЕННОСТЬ. ЗАТЕМ — ФОРМАТ.</p>
        <h1>Выбери свой<br /><em>способ создавать.</em></h1>
        <p className="catalog-lead">Одна философия CRAFT — разные уровни участия. Можно учиться самостоятельно, идти рядом с наставником или поручить разработку цифрового продукта команде CRAFT.</p>
      </section>

      <section className="formats-list wrap">
        {formats.map((item) => (
          <article className={`format-detail-card ${item.featured ? "format-detail-featured" : ""}`} id={item.id} key={item.id}>
            <div className="format-detail-index"><span>{item.number} / ФОРМАТ</span>{item.featured && <b>ЖИВОЕ СОПРОВОЖДЕНИЕ</b>}</div>
            <div className="format-detail-main">
              <div><h2>{item.name}</h2><p>{item.intro}</p></div>
              <div className="format-detail-price"><strong>{item.price}</strong><span>{item.cadence}</span></div>
            </div>
            <div className="format-detail-bottom">
              <div><span className="format-includes-label">ЧТО ВХОДИТ</span><ul>{item.includes.map((line) => <li key={line}>{line}</li>)}</ul></div>
              <p className="format-detail-note">{item.note}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="formats-principle"><div className="wrap"><p className="eyebrow">ВАЖНО ЗНАТЬ</p><h2>Одинаковая логика.<br /><em>Разные направления.</em></h2><p>Стоимость самостоятельного обучения и сопровождения не зависит от выбранного технологического направления. Для разработки под ключ стоимость рассчитывается по конкретной задаче. Приведённые суммы — предварительная модель, а не публичная оферта или подтверждение открытия продаж.</p></div></section>

      <section className="formats-cta wrap"><div><p className="eyebrow">СЛЕДУЮЩИЙ ШАГ</p><h2>Не уверен, какой формат подойдёт?<br /><em>Начни с идеи.</em></h2><p>Посмотри направления и проекты, которые можно создавать с CRAFT.</p></div><Link className="button button-dark" href="/directions">Изучить направления <span>↗</span></Link></section>

      <footer className="footer wrap"><Link className="brand" href="/">CRAFT<span>®</span></Link><p>ШКОЛА ЦИФРОВЫХ ПРОДУКТОВ</p><span>© 2026 CRAFT. Создавай осмысленно.</span></footer>
    </main>
  );
}
