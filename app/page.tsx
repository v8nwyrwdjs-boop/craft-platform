const steps = [
  ["01", "Выбрать путь", "Найди интересное направление или выбери готовую бизнес-концепцию."],
  ["02", "Разобраться в идее", "Вместе с наставником уточни аудиторию, проблему и способ монетизации."],
  ["03", "Проверить спрос", "Проведи исследование и проверь гипотезу до серьёзной разработки."],
  ["04", "Спроектировать и собрать", "Создай первую рабочую версию цифрового продукта."],
  ["05", "Запустить", "Найди первых пользователей, собери обратную связь и улучши решение."],
  ["06", "Развивать бизнес", "Разберись с экономикой, продажами и следующими точками роста."],
];

export default function Home() {
  return (
    <main>
      <header className="header wrap">
        <a className="brand" href="/" aria-label="CRAFT home">CRAFT<span>®</span></a>
        <nav aria-label="Основная навигация">
          <a href="/directions">Направления</a>
          <a href="/products">Готовые концепции</a>
          <a href="#approach">Как работает</a>
        </nav>
        <a className="header-cta" href="#choose">Выбрать свой путь <span>↗</span></a>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow"><i /> DIGITAL PRODUCT SCHOOL</p>
          <h1>Не просто изучай.<br /><em>Создай своё.</em></h1>
          <p className="hero-lead">Выбери направление или бизнес-концепцию. Вместе с CRAFT преврати её в цифровой продукт, проверь спрос и подготовь к запуску.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#choose">Выбрать, что создать <span>↗</span></a>
            <a className="text-link" href="#program">Как устроено обучение <span>↓</span></a>
          </div>
          <p className="hero-note">От бизнес-гипотезы до работающего продукта.</p>
        </div>
        <div className="hero-art" aria-label="Абстрактная композиция CRAFT">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-core"><span>C</span></div>
          <div className="art-tag tag-top">IDEA <b>→</b> PRODUCT</div>
          <div className="art-tag tag-bottom">MAKE IT REAL<span>✳</span></div>
          <div className="art-index">№ 001 / BUILDING</div>
        </div>
      </section>

      <div className="ticker"><div>THINK CLEAR <b>✳</b> BUILD SMART <b>✳</b> LAUNCH REAL <b>✳</b> THINK CLEAR <b>✳</b> BUILD SMART <b>✳</b> LAUNCH REAL <b>✳</b></div></div>

      <section className="choose-section" id="choose"><div className="wrap">
        <div className="section-head"><div><p className="eyebrow">01 / ДВА СПОСОБА НАЧАТЬ</p><h2>С чего начнём<br /><em>твой продукт?</em></h2></div><p>Не нужно приходить с готовым бизнес-планом. Выбери комфортную точку входа — дальнейший маршрут соберём вместе.</p></div>
        <div className="entry-grid">
          <a className="entry-card entry-directions" href="/directions"><span className="entry-index">ПУТЬ 01</span><span className="entry-icon">↗</span><h3>Найти своё<br /><em>направление.</em></h3><p>Пока не знаешь, что создавать? Изучи цифровые бизнес-модели и обсуди варианты с наставником.</p><span className="entry-link">Изучить направления <b>↗</b></span></a>
          <a className="entry-card entry-products" href="/products"><span className="entry-index">ПУТЬ 02</span><span className="entry-icon">✳</span><h3>Выбрать готовую<br /><em>концепцию.</em></h3><p>Есть желание быстрее перейти к конкретике? Выбери бизнес-гипотезу и адаптируй её вместе с наставником.</p><span className="entry-link">Открыть каталог концепций <b>↗</b></span></a>
        </div>
      </div></section>

      <section className="intro wrap" id="approach"><p className="eyebrow">02 / ПОДХОД CRAFT</p><div><h2>Не продаём мечту.<br /><span>Помогаем создать продукт.</span></h2><p className="intro-text">CRAFT — практическая мастерская создания цифрового бизнеса. Ты выбираешь направление или бизнес-концепцию, исследуешь реальную проблему, проверяешь спрос, создаёшь первую версию и выходишь к пользователям. На ключевых этапах можно советоваться с наставником и подключать дополнительную помощь.</p></div></section>

      <section className="program-section" id="program"><div className="wrap"><div className="section-head"><div><p className="eyebrow">03 / ПУТЬ СОЗДАТЕЛЯ</p><h2>Шесть этапов.<br /><em>Один свой продукт.</em></h2></div><p>Каждый этап заканчивается конкретным результатом, который становится частью твоего будущего бизнеса.</p></div><div className="steps">{steps.map(([n,title,desc])=><article className="step" key={n}><span className="step-no">{n}</span><div><h3>{title}</h3><p>{desc}</p></div><span className="step-arrow">↗</span></article>)}</div></div></section>

      <section className="format wrap" id="format"><p className="eyebrow">04 / ОБУЧЕНИЕ И ПОДДЕРЖКА</p><div className="format-grid"><h2>Делаешь сам.<br /><em>Не остаёшься один.</em></h2><div className="format-copy"><p>Базовый маршрут помогает двигаться самостоятельно. Когда нужна более глубокая помощь, можно подключить дополнительные форматы работы с наставником.</p><ul><li>Материалы и практические задания</li><li>Обратная связь по своему проекту</li><li>Консультации с наставником</li><li>Дополнительное сопровождение по запросу</li></ul></div></div></section>

      <section className="apply wrap" id="apply"><div className="apply-panel"><p className="eyebrow">05 / СЛЕДУЮЩИЙ ШАГ</p><h2>Есть идея?<br /><em>Давай превратим её в продукт.</em></h2><p>Расскажи, что хочешь создать или в каком направлении хочешь разобраться. Обсудим, с чего начать.</p><a className="button button-light" href="mailto:hello@craft.school?subject=CRAFT%20%E2%80%94%20%D0%BE%D0%B1%D1%81%D1%83%D0%B4%D0%B8%D1%82%D1%8C%20%D1%81%D1%82%D0%B0%D1%80%D1%82">Обсудить старт <span>↗</span></a><small>Содержание программ и условия участия будут опубликованы после подготовки пилота.</small></div></section>
      <footer className="footer wrap"><a className="brand" href="/">CRAFT<span>®</span></a><p>DIGITAL PRODUCT SCHOOL</p><span>© 2026 CRAFT. Создавай осмысленно.</span></footer>
    </main>
  );
}
