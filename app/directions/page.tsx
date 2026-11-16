const directions = [
  { number: "01", title: "SaaS и подписочные сервисы", description: "Цифровые инструменты, которые регулярно решают конкретную задачу и за которые клиент платит по подписке.", models: "Подписка · тарифы · freemium", examples: "Нишевые CRM, планировщики, аналитика, инструменты для специалистов", level: "Средняя / высокая" },
  { number: "02", title: "Маркетплейсы", description: "Площадки, которые соединяют две группы пользователей: клиентов и исполнителей, покупателей и продавцов.", models: "Комиссия · платное размещение · подписка", examples: "Нишевые услуги, аренда оборудования, локальные B2B-площадки", level: "Высокая" },
  { number: "03", title: "B2B-сервисы", description: "Продукты для бизнеса, которые сокращают расходы, экономят время или помогают зарабатывать больше.", models: "Подписка · лицензия · оплата за использование", examples: "Автоматизация процессов, документооборот, клиентские кабинеты", level: "Средняя / высокая" },
  { number: "04", title: "Онлайн-платформы и сообщества", description: "Цифровые пространства вокруг конкретной темы, профессии, интереса или регулярной потребности.", models: "Подписка · платный доступ · комиссия", examples: "Профессиональные сообщества, базы знаний, отраслевые платформы", level: "Средняя" },
  { number: "05", title: "Сервисы автоматизации", description: "Инструменты, которые убирают повторяющуюся ручную работу у частных специалистов и компаний.", models: "Подписка · пакеты операций · внедрение", examples: "Запись клиентов, уведомления, отчёты, интеграции", level: "Низкая / средняя" },
  { number: "06", title: "Нишевые цифровые продукты", description: "Узкие решения для определённой аудитории. Часто их проще проверить на небольшом сегменте рынка.", models: "Разовая покупка · подписка · платные функции", examples: "Калькуляторы, конфигураторы, базы данных, отраслевые инструменты", level: "Зависит от идеи" },
];

export default function DirectionsPage() {
  return (
    <main className="catalog-page">
      <header className="header wrap">
        <a className="brand" href="/">CRAFT<span>®</span></a>
        <nav aria-label="Основная навигация">
          <a href="/directions">Направления</a>
          <a href="/products">Готовые концепции</a>
          <a href="/#approach">Как работает CRAFT</a>
        </nav>
        <a className="header-cta" href="mailto:hello@craft.school?subject=CRAFT%20%E2%80%94%20%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BD%D0%B0%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F">Обсудить идею <span>↗</span></a>
      </header>

      <section className="catalog-hero wrap">
        <p className="eyebrow"><i /> CRAFT / НАПРАВЛЕНИЯ</p>
        <p className="catalog-kicker">ПУТЬ 01 — НАЙТИ СВОЮ ИДЕЮ</p>
        <h1>Сначала выбери<br /><em>направление.</em></h1>
        <p className="catalog-lead">Не обязательно приходить с готовой идеей. Разберёмся, какие цифровые бизнес-модели существуют, что тебе ближе и какую проблему стоит решать.</p>
        <div className="catalog-meta"><span>06 направлений для исследования</span><span>Идея вместе с наставником</span></div>
      </section>

      <section className="catalog-intro">
        <div className="wrap catalog-intro-grid">
          <p className="eyebrow">КАК ЭТО РАБОТАЕТ</p>
          <div><h2>Не угадываем бизнес.<br /><em>Находим возможность.</em></h2><p>Выбор направления — только начало. Вместе с наставником ты изучишь аудиторию, реальные задачи и альтернативы, сформулируешь гипотезу продукта и проверишь, есть ли основания двигаться дальше.</p></div>
        </div>
      </section>

      <section className="catalog-list wrap">
        <div className="catalog-section-head"><div><p className="eyebrow">БИБЛИОТЕКА ВОЗМОЖНОСТЕЙ</p><h2>Выбери, что<br /><em>хочешь исследовать.</em></h2></div><p>Это не рейтинг прибыльности и не обещание дохода. Сложность и модель заработка зависят от конкретной ниши и реализации.</p></div>
        <div className="direction-grid">
          {directions.map((item) => <article className="direction-card" key={item.number}>
            <div className="direction-card-top"><span>{item.number} / 06</span><span className="direction-mark">↗</span></div>
            <h3>{item.title}</h3><p>{item.description}</p>
            <div className="direction-detail"><span>ВОЗМОЖНАЯ МОНЕТИЗАЦИЯ</span><b>{item.models}</b></div>
            <div className="direction-detail"><span>ПРИМЕРЫ</span><b>{item.examples}</b></div>
            <div className="direction-bottom"><span>Сложность: {item.level}</span><a href="mailto:hello@craft.school?subject=CRAFT%20%E2%80%94%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BE%D0%B1%D1%81%D1%83%D0%B4%D0%B8%D1%82%D1%8C%20%D0%BD%D0%B0%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5">Обсудить <span>↗</span></a></div>
          </article>)}
        </div>
      </section>

      <section className="catalog-bridge"><div className="wrap catalog-bridge-inner"><div><p className="eyebrow">УЖЕ ЕСТЬ КОНКРЕТНАЯ ИДЕЯ?</p><h2>Посмотри готовые<br /><em>бизнес-концепции.</em></h2><p>Можно выбрать отправную точку и вместе с наставником адаптировать её под себя.</p></div><a className="button button-dark" href="/products">Открыть каталог <span>↗</span></a></div></section>
      <footer className="footer wrap"><a className="brand" href="/">CRAFT<span>®</span></a><p>DIGITAL PRODUCT SCHOOL</p><span>© 2026 CRAFT. Создавай осмысленно.</span></footer>
    </main>
  );
}
