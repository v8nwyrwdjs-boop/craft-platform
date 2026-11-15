const steps = [
  ["01", "Найти возможность", "Научимся замечать проблемы, за решение которых люди готовы платить."],
  ["02", "Проверить спрос", "Исследуем аудиторию, конкурентов и проверим идею до большой разработки."],
  ["03", "Спроектировать продукт", "Соберём понятный сценарий, структуру и первую версию продукта."],
  ["04", "Создать MVP", "Сделаем работающий цифровой продукт с помощью современных инструментов."],
  ["05", "Запустить и привлечь", "Найдём первых пользователей, соберём обратную связь и улучшим решение."],
  ["06", "Выстроить экономику", "Разберём монетизацию, юнит-экономику и следующие точки роста."],
];

export default function Home() {
  return (
    <main>
      <header className="header wrap">
        <a className="brand" href="#" aria-label="CRAFT home">CRAFT<span>®</span></a>
        <nav aria-label="Основная навигация">
          <a href="#approach">Подход</a>
          <a href="#program">Программа</a>
          <a href="#format">Формат</a>
        </nav>
        <a className="header-cta" href="#apply">Обсудить участие <span>↗</span></a>
      </header>

      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow"><i /> DIGITAL PRODUCT SCHOOL</p>
          <h1>Не просто изучай.<br /><em>Создай своё.</em></h1>
          <p className="hero-lead">Практическая программа, в которой ты пройдёшь путь от идеи до собственного цифрового продукта — с поддержкой на каждом этапе.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#apply">Стать участником <span>↗</span></a>
            <a className="text-link" href="#program">Изучить программу <span>↓</span></a>
          </div>
          <p className="hero-note">От первой гипотезы до первых пользователей.</p>
        </div>
        <div className="hero-art" aria-label="Абстрактная композиция CRAFT">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-core"><span>C</span></div>
          <div className="art-tag tag-top">IDEA <b>→</b> PRODUCT</div>
          <div className="art-tag tag-bottom">MAKE IT REAL<span>✳</span></div>
          <div className="art-index">№ 001 / BUILDING</div>
        </div>
      </section>

      <div className="ticker"><div>THINK CLEAR <b>✳</b> BUILD SMART <b>✳</b> LAUNCH REAL <b>✳</b> THINK CLEAR <b>✳</b> BUILD SMART <b>✳</b> LAUNCH REAL <b>✳</b></div></div>

      <section className="intro wrap" id="approach">
        <p className="eyebrow">01 / НАШ ПОДХОД</p>
        <div>
          <h2>Знания — это начало.<br /><span>Результат — это продукт.</span></h2>
          <p className="intro-text">CRAFT — не ещё один курс с уроками, которые откладывают «на потом». Это мастерская, где ты последовательно создаёшь собственный цифровой продукт: исследуешь проблему, принимаешь продуктовые решения, собираешь первую версию и выходишь к реальным пользователям.</p>
        </div>
      </section>

      <section className="program-section" id="program">
        <div className="wrap">
          <div className="section-head">
            <div><p className="eyebrow">02 / ПУТЬ СОЗДАТЕЛЯ</p><h2>Шесть этапов.<br /><em>Один свой продукт.</em></h2></div>
            <p>Не теория ради теории. Каждый этап заканчивается конкретным результатом, который становится частью твоего продукта.</p>
          </div>
          <div className="steps">
            {steps.map(([n, title, desc]) => <article className="step" key={n}>
              <span className="step-no">{n}</span><div><h3>{title}</h3><p>{desc}</p></div><span className="step-arrow">↗</span>
            </article>)}
          </div>
        </div>
      </section>

      <section className="format wrap" id="format">
        <p className="eyebrow">03 / КАК УСТРОЕНО</p>
        <div className="format-grid">
          <h2>Делаешь сам.<br /><em>Не остаёшься один.</em></h2>
          <div className="format-copy"><p>Ты двигаешься в собственном темпе, но по ясному маршруту. Получаешь структуру, практические задания, обратную связь и возможность разбирать решения вместе с наставником и группой.</p>
            <ul><li>Практические материалы и шаблоны</li><li>Задания на своём проекте</li><li>Групповые разборы и обратная связь</li><li>Поддержка на ключевых этапах</li></ul>
          </div>
        </div>
      </section>

      <section className="audience">
        <div className="wrap audience-grid">
          <div><p className="eyebrow">04 / КОМУ ПОДОЙДЁТ</p><h2>Для тех, кто хочет<br />перейти <em>от мыслей<br />к действиям.</em></h2></div>
          <div className="audience-list"><p><b>Подойдёт, если ты:</b></p><ul><li>Хочешь создать собственный онлайн-продукт или бизнес.</li><li>Пока не знаешь, какую идею выбрать и с чего начать.</li><li>Готов проверять гипотезы и делать, а не только смотреть уроки.</li></ul><p className="muted"><b>Не подойдёт</b>, если ты ищешь пассивный видеокурс или гарантию заработка без собственной работы.</p></div>
        </div>
      </section>

      <section className="apply wrap" id="apply">
        <div className="apply-panel">
          <p className="eyebrow">05 / СЛЕДУЮЩИЙ ШАГ</p>
          <h2>Есть идея?<br /><em>Давай превратим её в продукт.</em></h2>
          <p>Расскажи, что хочешь создать. Обсудим задачу, формат и подойдёт ли тебе CRAFT.</p>
          <a className="button button-light" href="mailto:hello@craft.school?subject=CRAFT%20%E2%80%94%20%D1%83%D1%87%D0%B0%D1%81%D1%82%D0%B8%D0%B5">Написать команде <span>↗</span></a>
          <small>Пилотный набор. Условия участия обсуждаются индивидуально.</small>
        </div>
      </section>

      <footer className="footer wrap"><a className="brand" href="#">CRAFT<span>®</span></a><p>DIGITAL PRODUCT SCHOOL</p><span>© 2026 CRAFT. Создавай осмысленно.</span></footer>
    </main>
  );
}