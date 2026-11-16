const products = [
  { id: "C-01", type: "MICRO-SAAS", title: "Управление записью для узких специалистов", problem: "Небольшие студии и частные специалисты теряют время на переписку, переносы и напоминания о визитах.", audience: "Небольшие сервисные бизнесы и независимые специалисты", revenue: "Ежемесячная подписка; тарифы по числу сотрудников или записей", mvp: "Страница записи, календарь, подтверждения и напоминания", difficulty: "Средняя", validation: "Поговорить с 10–15 специалистами, проверить текущие инструменты и готовность платить." },
  { id: "C-02", type: "B2B SAAS", title: "Простой контроль заявок для маленьких команд", problem: "Заявки приходят из разных каналов, теряются в чатах и остаются без ответа.", audience: "Небольшие агентства, студии и локальные компании", revenue: "Подписка на команду; платные интеграции", mvp: "Единый список заявок, статусы, ответственный и история контакта", difficulty: "Средняя", validation: "Разобрать процесс обработки заявок у нескольких компаний и получить подтверждение боли." },
  { id: "C-03", type: "NICHE MARKETPLACE", title: "Нишевой маркетплейс локальных услуг", problem: "Клиентам сложно находить проверенных исполнителей в узкой категории, а специалистам — получать целевые обращения.", audience: "Покупатели услуг и независимые исполнители в одной нише", revenue: "Комиссия, платное продвижение или подписка исполнителей", mvp: "Каталог, профили, запрос предложения и ручное сведение сторон", difficulty: "Высокая", validation: "Сначала вручную свести спрос и предложение в одной узкой категории." },
  { id: "C-04", type: "WORKFLOW TOOL", title: "Сбор документов и статусов в одном кабинете", problem: "Клиенты и подрядчики многократно запрашивают документы и уточняют статус работы по почте и в мессенджерах.", audience: "Небольшие B2B-команды с повторяющимся процессом согласования", revenue: "Подписка по числу проектов или клиентов", mvp: "Клиентский кабинет, чек-лист документов, статусы и уведомления", difficulty: "Средняя", validation: "Найти процесс с частыми повторными запросами и проверить готовность команды сменить текущий способ." },
  { id: "C-05", type: "DATA SUBSCRIPTION", title: "Отраслевая база данных с регулярными обновлениями", problem: "Специалисты тратят часы на сбор разрозненной информации, которая быстро устаревает.", audience: "Профессионалы одной конкретной отрасли", revenue: "Подписка на доступ; командные тарифы", mvp: "Курируемая база, фильтры, карточки объектов и дата обновления", difficulty: "Средняя", validation: "Проверить частоту использования информации и ценность актуальности для конкретной аудитории." },
  { id: "C-06", type: "CALCULATOR / SAAS", title: "Калькулятор решений для профессиональной ниши", problem: "Специалисты вручную считают стоимость, сроки или параметры по сложным таблицам и разрозненным правилам.", audience: "Одна профессия или сегмент малого бизнеса", revenue: "Бесплатный базовый инструмент и платные функции либо подписка", mvp: "Один точный сценарий расчёта, сохранение результата и экспорт", difficulty: "Низкая / средняя", validation: "Проверить, насколько часто выполняется расчёт, сколько ошибок он создаёт и кто платит за решение." },
];

export default function ProductsPage() {
  return (
    <main className="catalog-page">
      <header className="header wrap">
        <a className="brand" href="/">CRAFT<span>®</span></a>
        <nav aria-label="Основная навигация">
          <a href="/directions">Направления</a>
          <a href="/products">Готовые концепции</a>
          <a href="/#approach">Как работает CRAFT</a>
        </nav>
        <a className="header-cta" href="/register">Обсудить концепцию <span>↗</span></a>
      </header>

      <section className="catalog-hero wrap">
        <p className="eyebrow"><i /> CRAFT / БИБЛИОТЕКА ПРОДУКТОВ</p>
        <p className="catalog-kicker">ПУТЬ 02 — ВЫБРАТЬ ОТПРАВНУЮ ТОЧКУ</p>
        <h1>Выбери концепцию.<br /><em>Создай своё.</em></h1>
        <p className="catalog-lead">Здесь собраны отправные бизнес-гипотезы: какую проблему можно решать, для кого, как продукт может зарабатывать и с чего начать проверку.</p>
        <div className="catalog-meta"><span>06 демонстрационных концепций</span><span>Каждую можно адаптировать с наставником</span></div>
      </section>

      <section className="catalog-note"><div className="wrap catalog-note-inner"><span className="note-symbol">i</span><p><b>Важно:</b> это не готовые работающие компании и не проверенные инвестиционные возможности. Это гипотезы для исследования. До разработки ученик вместе с наставником уточняет нишу, проверяет спрос и принимает решение, стоит ли продолжать.</p></div></section>

      <section className="catalog-list wrap">
        <div className="catalog-section-head"><div><p className="eyebrow">КОНЦЕПЦИИ ДЛЯ СТАРТА</p><h2>Выбери проблему,<br /><em>которую хочешь решить.</em></h2></div><p>Карточки показывают возможную структуру продукта, но не заменяют исследование конкретного рынка.</p></div>
        <div className="product-list">
          {products.map((item) => <article className="product-card" key={item.id}>
            <div className="product-card-head"><span>{item.id} / {item.type}</span><span className="product-arrow">↗</span></div>
            <div className="product-card-main"><h3>{item.title}</h3><p>{item.problem}</p><div className="product-fields"><div><span>ДЛЯ КОГО</span><b>{item.audience}</b></div><div><span>КАК МОЖЕТ ЗАРАБАТЫВАТЬ</span><b>{item.revenue}</b></div><div><span>ВОЗМОЖНЫЙ MVP</span><b>{item.mvp}</b></div><div><span>ПЕРВАЯ ПРОВЕРКА</span><b>{item.validation}</b></div></div></div>
            <div className="product-card-foot"><span>Сложность реализации: {item.difficulty}</span><a href={`/register?concept=${item.id}`}>Обсудить с наставником <span>↗</span></a></div>
          </article>)}
        </div>
      </section>

      <section className="catalog-bridge"><div className="wrap catalog-bridge-inner"><div><p className="eyebrow">НЕ НАШЁЛ СВОЮ ИДЕЮ?</p><h2>Начни с выбора<br /><em>направления.</em></h2><p>Изучим бизнес-модели и найдём возможность, которая подходит твоим интересам и ресурсам.</p></div><a className="button button-dark" href="/directions">Смотреть направления <span>↗</span></a></div></section>
      <footer className="footer wrap"><a className="brand" href="/">CRAFT<span>®</span></a><p>DIGITAL PRODUCT SCHOOL</p><span>© 2026 CRAFT. Создавай осмысленно.</span></footer>
    </main>
  );
}
