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
          <a href="#products">Продукты</a>
          <a href="#directions">Направления</a>
          <a href="#method">Как мы работаем</a>
        </nav>
        <div className="header-account"><a href="/login">Войти</a><a className="header-cta" href="/register">Присоединиться <span>↗</span></a></div>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow"><i /> ШКОЛА ЦИФРОВЫХ ПРОДУКТОВ</p>
          <h1>Не просто учись.<br /><em>Создавай своё.</em></h1>
          <p className="hero-lead">В CRAFT ты не остаёшься с теорией один на один. Мы вместе разбираем технологии, создаём настоящий цифровой продукт и доводим идею до результата — даже если ты начинаешь с нуля.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#products">Выбрать, что создать <span>↗</span></a>
            <a className="text-link" href="#method">Узнать, как всё устроено <span>↓</span></a>
          </div>
          <div className="hero-proof"><span>С НУЛЯ</span><i/><span>ВМЕСТЕ С НАСТАВНИКОМ</span><i/><span>СО СВОИМ ПРОЕКТОМ</span></div>
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

      <section className="directions-section" id="directions">
        <div className="wrap">
          <div className="section-head">
            <div><p className="eyebrow">02 / ОБЛАСТИ, КОТОРЫЕ МЫ ИССЛЕДУЕМ</p><h2>Найди своё<br /><em>направление.</em></h2></div>
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
          <div className="manifesto-aside"><p className="eyebrow">03 / ФИЛОСОФИЯ CRAFT</p><span className="manifesto-stamp">НЕ УЧИМ<br/>ВПУСТУЮ<span>✳</span></span></div>
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
            <div><p className="eyebrow">04 / ОТ ИДЕИ ДО РЕЗУЛЬТАТА</p><h2>Шаг за шагом.<br /><em>Вместе с тобой.</em></h2></div>
            <p>Не нужно знать всё заранее. Мы выстраиваем понятный маршрут и помогаем двигаться вперёд на каждом этапе.</p>
          </div>
          <div className="journey-list">{stages.map(([number,title,description]) => (
            <article className="journey-step" key={number}><span className="journey-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><span className="journey-arrow">↗</span></article>
          ))}</div>
        </div>
      </section>

      <section className="start-section">
        <div className="wrap start-grid">
          <div><p className="eyebrow">05 / МОЖНО НАЧАТЬ С НУЛЯ</p><h2>Неважно,<br />что ты уже знаешь.<br /><em>Важно, что создашь.</em></h2></div>
          <div className="start-copy"><p>Никогда не программировал? Не знаешь, как устроен ИИ или цифровой бизнес? Это не повод откладывать идею. Мы начинаем с понятных основ, разбираем каждый шаг и постепенно переходим к практике.</p><div className="start-points"><span><b>01</b> Понятные объяснения без лишнего жаргона</span><span><b>02</b> Практика на собственном проекте</span><span><b>03</b> Поддержка и обратная связь по ходу работы</span></div><a className="text-link" href="/directions">Посмотреть направления <span>↗</span></a></div>
        </div>
      </section>

      <section className="apply wrap" id="join">
        <div className="apply-panel"><p className="eyebrow">06 / ТВОЯ ИДЕЯ МОЖЕТ СТАТЬ ПРОЕКТОМ</p><h2>Давай создадим<br /><em>что-то настоящее.</em></h2><p>Изучи направления, выбери идею или приходи со своей. Следующий шаг — обсудить, что можно построить вместе.</p><a className="button button-light" href="/register">Начать знакомство с CRAFT <span>↗</span></a><small>Программы находятся в стадии формирования. Конкретные условия и даты запуска будут опубликованы отдельно.</small></div>
      </section>

      <footer className="footer wrap"><a className="brand" href="/">CRAFT<span>®</span></a><p>ШКОЛА ЦИФРОВЫХ ПРОДУКТОВ</p><span>© 2026 CRAFT. Создавай осмысленно.</span></footer>
    </main>
  );
}
