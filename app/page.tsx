import { ProductShowcase } from "../components/product-showcase";

const directions = [
  { no: "01", title: "SaaS и цифровые продукты", text: "Сервисы по подписке, приложения, платформы и модели цифрового бизнеса.", mark: "S" },
  { no: "02", title: "Искусственный интеллект", text: "ИИ-приложения, языковые модели, агенты и интеллектуальные инструменты.", mark: "AI" },
  { no: "03", title: "Блокчейн и Web3", text: "Токены, смарт-контракты, децентрализованные решения и цифровая экономика.", mark: "W3" },
  { no: "04", title: "Разработка с ИИ", text: "Создание сайтов и приложений с ИИ-инструментами — даже если ты начинаешь с нуля.", mark: "{ }" },
  { no: "05", title: "Медиа и авторские проекты", text: "Собственные медиа, контент-системы, развитие аудитории и монетизация.", mark: "M" },
  { no: "06", title: "Агентная коммерция", text: "Новые модели торговли, в которых ИИ-агенты помогают выбирать, продавать и выполнять задачи.", mark: "A" },
  { no: "07", title: "Дизайн цифровых продуктов", text: "Исследование пользователей, удобные интерфейсы и визуальные системы.", mark: "D" },
  { no: "08", title: "Автоматизация бизнеса", text: "Связанные инструменты и процессы, которые освобождают время для важных задач.", mark: "↗" },
];

const stages = [
  ["01", "Выбираем идею", "Определяем, что интересно именно тебе, и формулируем задачу будущего проекта."],
  ["02", "Разбираемся с основами", "Объясняем технологии и термины простым языком. Предварительный опыт не нужен."],
  ["03", "Проверяем задумку", "Изучаем аудиторию, конкурентов и спрос, чтобы не строить продукт вслепую."],
  ["04", "Создаём вместе", "Проектируем, разрабатываем и собираем первую рабочую версию своего продукта."],
  ["05", "Тестируем и улучшаем", "Показываем решение пользователям, собираем обратную связь и исправляем слабые места."],
  ["06", "Готовим к развитию", "Разбираемся с запуском, первыми клиентами и дальнейшими шагами проекта."],
];

export default function Home() {
  return (
    <main className="home-page">
      <header className="header wrap">
        <a className="brand" href="/" aria-label="CRAFT — главная">CRAFT<span>®</span></a>
        <nav aria-label="Основная навигация">
          <a href="#products">Что создадим</a>
          <a href="#directions">Направления</a>
          <a href="#method">Метод CRAFT</a>
        </nav>
        <div className="header-account"><a href="/login">Войти</a><a className="header-cta" href="/register">Присоединиться <span>↗</span></a></div>
      </header>

      <nav className="home-category-nav wrap" aria-label="Популярные направления">
        <a href="#products" className="category-pill category-featured">Популярное <span>✳</span></a>
        <a href="#directions" className="category-pill">Искусственный интеллект</a>
        <a href="#directions" className="category-pill">Разработка с ИИ</a>
        <a href="#directions" className="category-pill">SaaS и сервисы</a>
        <a href="#directions" className="category-pill">Автоматизация</a>
        <a href="#directions" className="category-pill">Дизайн</a>
        <a href="#directions" className="category-pill">Медиа и контент</a>
        <a href="#directions" className="category-pill">Web3</a>
      </nav>

      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow"><i /> ШКОЛА ЦИФРОВЫХ ПРОДУКТОВ</p>
          <h1>Хватит просто<br />потреблять.<br /><em>Создавай своё.</em></h1>
          <p className="hero-lead">Здесь знания превращаются в работающие решения. Выбирай направление, разбирайся в технологиях с нуля и создавай собственный цифровой продукт — с человеческой обратной связью на каждом важном этапе.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#products">Найти свою идею <span>↗</span></a>
            <a className="text-link" href="#method">Как устроен CRAFT <span>↓</span></a>
          </div>
          <div className="hero-proof"><span>С НУЛЯ</span><i/><span>ЖИВАЯ ОБРАТНАЯ СВЯЗЬ</span><i/><span>СО СВОИМ ПРОЕКТОМ</span></div>
        </div>
        <div className="hero-art" aria-label="Графическая композиция о создании цифрового продукта">
          <div className="hero-art-label">CRAFT / WORKSHOP № 001</div>
          <div className="hero-art-orbit orbit-one"/><div className="hero-art-orbit orbit-two"/>
          <div className="hero-art-shape"><span>C</span></div>
          <div className="hero-art-chip chip-one">ИДЕЯ</div><div className="hero-art-chip chip-two">ПРОДУКТ</div>
          <div className="hero-art-bottom"><span>ОТ ПЕРВОГО ШАГА</span><b>ДО ЗАПУСКА ↗</b></div>
        </div>
      </section>

      <div className="ticker" aria-label="Принципы CRAFT"><div>ДУМАТЬ <b>✳</b> СОЗДАВАТЬ <b>✳</b> ПРОВЕРЯТЬ <b>✳</b> ЗАПУСКАТЬ <b>✳</b> ДУМАТЬ <b>✳</b> СОЗДАВАТЬ <b>✳</b> ПРОВЕРЯТЬ <b>✳</b> ЗАПУСКАТЬ <b>✳</b></div></div>

      <ProductShowcase />

      <section className="human-edge-section"><div className="wrap human-edge-grid"><div><p className="eyebrow">02 / ПРИНЦИП CRAFT</p><h2>Тебе отвечает<br /><em>человек. Не бот.</em></h2></div><div className="human-edge-copy"><p>Вопросы не должны теряться в бесконечной ленте чата. В формате с наставником ты получаешь содержательный разбор своей задачи, помощь с инструментами и обратную связь по собственному проекту.</p><div className="human-edge-points"><span><b>01</b> Разбираем именно твою ситуацию</span><span><b>02</b> Помогаем понять ошибки, а не просто исправить их</span><span><b>03</b> Двигаемся к работающему результату</span></div><a className="text-link" href="/formats#mentorship">Узнать о сопровождении <span>↗</span></a></div></div></section>

      <section className="offers-section" id="formats">
        <div className="wrap">
          <div className="section-head offers-heading">
            <div><p className="eyebrow">03 / ВЫБЕРИ ФОРМАТ УЧАСТИЯ</p><h2>Один путь.<br /><em>Три способа пройти его.</em></h2></div>
            <p>Выбирай нужный уровень участия: самостоятельная практика, персональное сопровождение или заказная разработка силами CRAFT.</p>
          </div>
          <div className="offer-grid">
            <article className="offer-card">
              <div className="offer-top"><span>01 / САМОСТОЯТЕЛЬНО</span><span className="offer-mark">↗</span></div>
              <h3>База</h3>
              <p className="offer-fit">Для тех, кто хочет разобраться самостоятельно и двигаться в своём темпе.</p>
              <p className="offer-summary">Понятный маршрут, чтобы разобраться в теме и попробовать всё своими руками.</p>
              <ul><li>Структурированные уроки от основ</li><li>Пошаговые инструкции и примеры</li><li>Шаблоны, чек-листы и полезные материалы</li><li>Доступ к обновлениям программы</li></ul>
              <a className="offer-link" href="/formats#self-study">Изучить формат <b>↗</b></a>
            </article>
            <article className="offer-card offer-card-featured">
              <div className="offer-top"><span>02 / С НАСТАВНИКОМ</span><span className="offer-mark">✳</span></div>
              <div className="offer-ribbon">ЖИВАЯ ОБРАТНАЯ СВЯЗЬ</div>
              <h3>С сопровождением</h3>
              <p className="offer-fit">Для тех, кому важны живой разбор решений, обратная связь и поддержка наставника.</p>
              <p className="offer-summary">Не просто смотришь уроки — разбираешь свои решения с человеком, который помогает двигаться дальше.</p>
              <ul><li>Всё из самостоятельного формата</li><li>Персональный разбор твоего проекта</li><li>Обратная связь по выполненным этапам</li><li>Помощь с инструментами и ошибками</li></ul>
              <a className="offer-link" href="/formats#mentorship">Как устроено сопровождение <b>↗</b></a>
            </article>
            <article className="offer-card">
              <div className="offer-top"><span>03 / СОЗДАЁМ ВМЕСТЕ</span><span className="offer-mark">↗</span></div>
              <h3>Под ключ</h3>
              <p className="offer-fit">Для тех, кому нужен готовый цифровой продукт, созданный командой CRAFT под задачу.</p>
              <p className="offer-summary">Ты формулируешь задачу и требования. CRAFT проектирует и разрабатывает согласованное решение, затем передаёт проект, исходники и инструкции.</p>
              <ul><li>Обсуждение задачи и требований</li><li>Согласование объёма и этапов работы</li><li>Разработка и проверка решения командой CRAFT</li><li>Передача проекта, исходников и документации</li></ul>
              <a className="offer-link" href="/formats#done-for-you">Условия разработки <b>↗</b></a>
            </article>
          </div>
          <p className="offer-disclaimer">Форматы и предварительная комплектация описаны отдельно. Сроки, объём работ, правки и условия фиксируются до начала конкретной программы или проекта.</p>
        </div>
      </section>

      <section className="membership-section" id="membership">
        <div className="wrap membership-grid">
          <div><p className="eyebrow">04 / CRAFT CLUB</p><h2>Не учиться в одиночку.<br /><em>Быть среди своих.</em></h2><p className="membership-lead">Подписка для тех, кто хочет оставаться в движении, получать новые идеи и иметь место, где можно спросить, показать прогресс и найти единомышленников.</p></div>
          <article className="membership-card">
            <div className="offer-top"><span>ЕЖЕМЕСЯЧНАЯ ПОДПИСКА</span><span className="offer-mark">✳</span></div>
            <p className="membership-fit">Для тех, кто хочет оставаться в профессиональном движении, обмениваться опытом и регулярно практиковаться.</p>
            <ul><li>Закрытое сообщество участников CRAFT</li><li>Ежемесячные практические воркшопы</li><li>Библиотека шаблонов, инструкций и разборов</li><li>Групповые часы вопросов и ответов</li><li>Специальные цены на программы и мероприятия</li><li>Ранний доступ к новым направлениям</li></ul>
            <a className="button button-dark" href="/formats#club">Узнать о CRAFT CLUB <span>↗</span></a>
            <small className="membership-note">Состав клуба и график активностей будут подтверждены до открытия подписки. Клуб не заменяет персональное наставничество и не включает индивидуальную разработку проекта.</small>
          </article>
        </div>
      </section>

      <section className="directions-section" id="directions">
        <div className="wrap">
          <div className="section-head">
            <div><p className="eyebrow">05 / ОБЛАСТИ, КОТОРЫЕ МЫ ИССЛЕДУЕМ</p><h2>Найди своё<br /><em>направление.</em></h2></div>
            <p>От цифрового бизнеса и искусственного интеллекта до медиа и новых моделей торговли. Начать можно с любого уровня — основы разберём вместе.</p>
          </div>
          <div className="direction-showcase">
            {directions.map((direction) => (
              <a className="direction-tile" href="/directions" key={direction.no}>
                <span className="direction-no">{direction.no} / НАПРАВЛЕНИЕ</span>
                <span className="direction-symbol">{direction.mark}</span>
                <h3>{direction.title}</h3>
                <p>{direction.text}</p>
                <span className="direction-open">Изучить направление <b>↗</b></span>
              </a>
            ))}
          </div>
          <div className="directions-more"><span>Не знаешь, с чего начать? Это нормально.</span><a href="/directions">Посмотреть все направления <b>↗</b></a></div>
        </div>
      </section>

      <section className="manifesto-section" id="method">
        <div className="wrap manifesto-grid">
          <div className="manifesto-aside"><p className="eyebrow">06 / ФИЛОСОФИЯ CRAFT</p><span className="manifesto-stamp">НЕ УЧИМ<br/>ВПУСТУЮ<span>✳</span></span></div>
          <div className="manifesto-main">
            <h2>Здесь не заканчивают курс.<br /><em>Здесь создают свой продукт.</em></h2>
            <p>Главная идея CRAFT проста: знания должны превращаться в действие. Поэтому мы не ограничиваемся уроками и упражнениями — мы вместе с тобой проходим путь создания настоящего проекта. Ты понимаешь, почему принимаешь каждое решение, учишься на практике и видишь, как идея становится работающим продуктом.</p>
            <div className="manifesto-values"><div><b>01</b><span>Объясняем сложное<br/>простым языком</span></div><div><b>02</b><span>Создаём вместе,<br/>а не вместо тебя</span></div><div><b>03</b><span>На выходе —<br/>твой проект</span></div></div>
          </div>
        </div>
      </section>

      <section className="journey-section">
        <div className="wrap">
          <div className="section-head">
            <div><p className="eyebrow">07 / ОТ ИДЕИ ДО РЕЗУЛЬТАТА</p><h2>Шаг за шагом.<br /><em>Вместе с тобой.</em></h2></div>
            <p>Не нужно знать всё заранее. Мы выстраиваем понятный маршрут и помогаем двигаться вперёд на каждом этапе.</p>
          </div>
          <div className="journey-list">{stages.map(([number,title,description]) => (
            <article className="journey-step" key={number}><span className="journey-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><span className="journey-arrow">↗</span></article>
          ))}</div>
        </div>
      </section>

      <section className="start-section">
        <div className="wrap start-grid">
          <div><p className="eyebrow">08 / МОЖНО НАЧАТЬ С НУЛЯ</p><h2>Неважно,<br />что ты уже знаешь.<br /><em>Важно, что создашь.</em></h2></div>
          <div className="start-copy"><p>Никогда не программировал? Не знаешь, как устроен ИИ или цифровой бизнес? Это не повод откладывать идею. Мы начинаем с понятных основ, разбираем каждый шаг и постепенно переходим к практике.</p><div className="start-points"><span><b>01</b> Понятные объяснения без лишнего жаргона</span><span><b>02</b> Практика на собственном проекте</span><span><b>03</b> Поддержка и обратная связь по ходу работы</span></div><a className="text-link" href="/directions">Посмотреть направления <span>↗</span></a></div>
        </div>
      </section>

      <section className="apply wrap" id="join">
        <div className="apply-panel"><p className="eyebrow">09 / ТВОЯ ИДЕЯ МОЖЕТ СТАТЬ ПРОЕКТОМ</p><h2>Давай создадим<br /><em>что-то настоящее.</em></h2><p>Изучи направления, выбери идею или приходи со своей. Следующий шаг — обсудить, что можно построить вместе.</p><a className="button button-light" href="/formats">Выбрать свой формат <span>↗</span></a><small>Программы находятся в стадии формирования. Конкретные условия и даты запуска будут опубликованы отдельно.</small></div>
      </section>

      <footer className="footer wrap"><a className="brand" href="/">CRAFT<span>®</span></a><p>ШКОЛА ЦИФРОВЫХ ПРОДУКТОВ</p><span>© 2026 CRAFT. Создавай осмысленно.</span></footer>
    </main>
  );
}
