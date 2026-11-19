import Link from "next/link";
import { CraftScrollStory } from "../components/craft-scroll-story";

const products = [
  {
    number: "01",
    kind: "AI / ПРИЛОЖЕНИЕ",
    title: "Собственный AI-инструмент",
    description: "Сервис на основе языковой модели, который помогает решать конкретную задачу — от идеи до проверяемого прототипа.",
    mark: "AI",
    art: "ai",
  },
  {
    number: "02",
    kind: "SAAS / СЕРВИС",
    title: "Продукт по подписке",
    description: "Веб-сервис с понятной аудиторией, полезной функцией и первой версией, которую можно показать пользователям.",
    mark: "S",
    art: "saas",
  },
  {
    number: "03",
    kind: "WEB / ПЛАТФОРМА",
    title: "Сайт или цифровая платформа",
    description: "Собственный цифровой интерфейс: от простого сайта до платформы с аккаунтами, данными и рабочими сценариями.",
    mark: "W",
    art: "platform",
  },
  {
    number: "04",
    kind: "AGENTS / AUTOMATION",
    title: "Система AI-агентов",
    description: "Связанные агенты и автоматизации, которые используют инструменты и выполняют последовательность задач под контролем человека.",
    mark: "↗",
    art: "agents",
  },
];

const directions = [
  ["01", "SaaS и цифровые продукты", "Сервисы по подписке, приложения, платформы и модели цифрового бизнеса."],
  ["02", "Искусственный интеллект", "ИИ-приложения, языковые модели, агенты и интеллектуальные инструменты."],
  ["03", "Блокчейн и Web3", "Токены, смарт-контракты, децентрализованные решения и цифровая экономика."],
  ["04", "Разработка с ИИ", "Создание сайтов и приложений с ИИ-инструментами — даже если ты начинаешь с нуля."],
  ["05", "Медиа и авторские проекты", "Собственные медиа, контент-системы, развитие аудитории и монетизация."],
  ["06", "Агентная коммерция", "Новые модели торговли, в которых ИИ-агенты помогают выбирать, продавать и выполнять задачи."],
  ["07", "Дизайн цифровых продуктов", "Исследование пользователей, удобные интерфейсы и визуальные системы."],
  ["08", "Автоматизация бизнеса", "Связанные инструменты и процессы, которые освобождают время для важных задач."],
];

const journey = [
  ["01", "Выбираем идею", "Определяем интерес и формулируем задачу, которую должен решать будущий проект."],
  ["02", "Разбираемся в основе", "Понимаем технологии и термины простым языком. Предварительный опыт не обязателен."],
  ["03", "Проверяем гипотезу", "Изучаем аудиторию, альтернативы и спрос, прежде чем строить продукт."],
  ["04", "Собираем первую версию", "Проектируем интерфейс, выбираем инструменты и создаём работающий прототип."],
  ["05", "Тестируем и улучшаем", "Показываем решение людям, собираем обратную связь и исправляем слабые места."],
  ["06", "Планируем развитие", "Разбираемся с дальнейшими шагами, запуском и поддержкой продукта."],
];

export const metadata = {
  title: "CRAFT — от идеи к цифровому продукту",
  description: "Изучай технологии, проверяй гипотезы и создавай собственный цифровой продукт с практикой и человеческой обратной связью.",
};

export default function Home() {
  return (
    <main className="craft-home" id="main-content">
      <a className="skip-link" href="#story">Перейти к основному содержанию</a>

      <header className="craft-header">
        <div className="craft-header-inner">
          <Link className="craft-brand" href="/" aria-label="CRAFT — главная">CRAFT<span>®</span></Link>
          <nav className="craft-nav" aria-label="Основная навигация">
            <Link href="#story">История</Link>
            <Link href="#products">Каталог</Link>
            <Link href="#directions">Направления</Link>
            <Link href="#method">Метод CRAFT</Link>
          </nav>
          <div className="craft-header-actions">
            <Link href="/login">Войти</Link>
            <Link className="craft-button craft-button-small" href="/register">Начать путь <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </header>

      <section className="craft-hero" aria-labelledby="craft-home-title">
        <div className="craft-hero-grid">
          <div className="craft-hero-copy">
            <p className="craft-kicker"><span className="craft-kicker-dot" /> ЦИФРОВЫЕ ПРОДУКТЫ / ОТ ИДЕИ К РЕАЛИЗАЦИИ</p>
            <h1 id="craft-home-title">Из идеи —<br /><em>в цифровой</em><br />продукт.</h1>
            <p className="craft-hero-lead">
              CRAFT помогает разобраться в технологиях, проверить задумку и собрать собственный цифровой продукт — с практикой, понятным маршрутом и человеческой обратной связью.
            </p>
            <div className="craft-hero-actions">
              <Link className="craft-button" href="#directions">Найти направление <span aria-hidden="true">↗</span></Link>
              <Link className="craft-button craft-button-quiet" href="#story">Посмотреть историю <span aria-hidden="true">↓</span></Link>
            </div>
            <div className="craft-hero-meta" aria-label="Подход CRAFT">
              <span>С НУЛЯ — ЕСЛИ НУЖНО</span>
              <span>ПРАКТИКА НА СВОЁМ ПРОЕКТЕ</span>
              <span>ЖИВАЯ ОБРАТНАЯ СВЯЗЬ</span>
            </div>
          </div>

          <div className="craft-hero-art" aria-hidden="true">
            <div className="craft-hero-binary">
              <span>0101 0010 1010 0101 0110 1001 0101</span>
              <span>1100 0101 0011 1010 0110 0101 1100</span>
              <span>0010 1011 0101 0010 1101 0100 1011</span>
              <span>1010 0101 1100 0011 0101 1001 0110</span>
              <span>0110 1001 0101 1100 0010 1011 0101</span>
              <span>0101 0110 1001 0010 1010 0101 1100</span>
            </div>
            <div className="craft-hero-object"><span>CRAFT</span></div>
            <span className="craft-hero-coordinate">OBJECT / 001 — DIGITAL MATERIAL</span>
          </div>
        </div>
        <a className="craft-scroll-cue" href="#story">ПРОКРУТИ, ЧТОБЫ УВИДЕТЬ ПРЕВРАЩЕНИЕ <span aria-hidden="true">↓</span></a>
      </section>

      <CraftScrollStory />

      <section className="craft-section craft-products" id="products">
        <div className="craft-section-inner">
          <div className="craft-section-head">
            <div>
              <p className="craft-kicker"><span className="craft-kicker-dot" /> 02 / КАТАЛОГ CRAFT</p>
              <h2>Найди направление.<br /><em>Создай своё.</em></h2>
            </div>
            <p className="craft-section-intro">
              Примеры цифровых продуктов, которые можно изучать, проектировать и собирать. Каждый начинается с задачи, аудитории и проверки гипотезы.
            </p>
          </div>
          <div className="craft-product-grid">
            {products.map((product) => (
              <article className="craft-product-card" key={product.number}>
                <div className={"craft-product-art craft-product-art-" + product.art} aria-hidden="true">
                  <span className="craft-product-art-mark">{product.mark}</span>
                  <span className="craft-product-art-index">{product.number} / STUDY</span>
                </div>
                <div className="craft-product-card-body">
                  <p className="craft-product-meta">{product.kind}</p>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                </div>
              </article>
            ))}
          </div>
          <Link className="craft-text-link" href="/directions">Открыть все направления CRAFT <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="craft-section craft-directions" id="directions">
        <div className="craft-section-inner">
          <div className="craft-section-head">
            <div>
              <p className="craft-kicker"><span className="craft-kicker-dot" /> 03 / ОБЛАСТИ ИССЛЕДОВАНИЯ</p>
              <h2>Выбери область.<br /><em>Найди свою задачу.</em></h2>
            </div>
            <p className="craft-section-intro">
              Необязательно приходить с готовой идеей. Можно начать с интереса, посмотреть на разные модели и постепенно выбрать направление своего проекта.
            </p>
          </div>
          <div className="craft-direction-list">
            {directions.map(([number, title, description]) => (
              <Link className="craft-direction-link" href="/directions" key={number}>
                <span className="craft-direction-number">{number}</span>
                <span><h3>{title}</h3><p>{description}</p></span>
                <span className="craft-direction-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
          <Link className="craft-text-link" href="/directions">Все направления CRAFT <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="craft-principle">
        <div className="craft-principle-grid">
          <div>
            <p className="craft-kicker"><span className="craft-kicker-dot" /> 04 / ПРИНЦИП CRAFT</p>
            <h2>Создаёшь сам.<br /><em>Но не в одиночку.</em></h2>
          </div>
          <div className="craft-principle-copy">
            <p>
              Уроки помогают разобраться в теме, но не заменяют работу над собственным проектом. В формате с наставником ты получаешь разбор решений, помощь с инструментами и обратную связь по ходу работы.
            </p>
            <div className="craft-principle-points">
              <span><b>01</b> Разбираем именно твою ситуацию</span>
              <span><b>02</b> Объясняем причины ошибок, а не только исправления</span>
              <span><b>03</b> Помогаем двигаться к работающей версии</span>
            </div>
            <Link className="craft-text-link" href="/formats#mentorship">Как устроено сопровождение <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="craft-section craft-method" id="method">
        <div className="craft-section-inner">
          <div className="craft-section-head">
            <div>
              <p className="craft-kicker"><span className="craft-kicker-dot" /> 05 / МЕТОД CRAFT</p>
              <h2>Шесть шагов.<br /><em>Один свой продукт.</em></h2>
            </div>
            <p className="craft-section-intro">
              Движемся от формулировки задачи к прототипу и следующему обоснованному шагу. Темп и глубина зависят от проекта.
            </p>
          </div>
          <div className="craft-method-list">
            {journey.map(([number, title, description]) => (
              <article className="craft-method-row" key={number}>
                <span className="craft-method-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="craft-method-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="craft-section craft-formats" id="formats">
        <div className="craft-section-inner">
          <div className="craft-section-head">
            <div>
              <p className="craft-kicker"><span className="craft-kicker-dot" /> 06 / ФОРМАТЫ УЧАСТИЯ</p>
              <h2>Один подход.<br /><em>Три формата работы.</em></h2>
            </div>
            <p className="craft-section-intro">
              Выбирай не «уровень успеха», а подходящий объём самостоятельной работы и поддержки.
            </p>
          </div>
          <div className="craft-format-grid">
            <article className="craft-format-card">
              <div className="craft-format-index"><span>01 / САМОСТОЯТЕЛЬНО</span><span>OWN PACE</span></div>
              <h3>Самостоятельно</h3>
              <p>Структурированный маршрут, чтобы изучить тему и собрать первые элементы проекта в своём темпе.</p>
              <ul>
                <li>Последовательные уроки и практика</li>
                <li>Инструкции, примеры и шаблоны</li>
                <li>Материалы для самостоятельной проверки</li>
              </ul>
              <Link className="craft-format-link" href="/formats#self-study">Изучить формат <span aria-hidden="true">↗</span></Link>
            </article>
            <article className="craft-format-card craft-format-card-featured">
              <div className="craft-format-index"><span>02 / С НАСТАВНИКОМ</span><span>HUMAN FEEDBACK</span></div>
              <h3>С сопровождением</h3>
              <p>Самостоятельная работа плюс человеческая обратная связь по идее, решениям и этапам проекта.</p>
              <ul>
                <li>Всё из самостоятельного формата</li>
                <li>Разбор вопросов и решений</li>
                <li>Обратная связь по этапам работы</li>
              </ul>
              <Link className="craft-format-link" href="/formats#mentorship">Как устроено сопровождение <span aria-hidden="true">↗</span></Link>
            </article>
            <article className="craft-format-card">
              <div className="craft-format-index"><span>03 / ПОД КЛЮЧ</span><span>DEVELOPMENT</span></div>
              <h3>Разработка под ключ</h3>
              <p>Отдельная услуга: CRAFT проектирует и создаёт согласованный цифровой продукт по твоей задаче.</p>
              <ul>
                <li>Обсуждение требований и объёма</li>
                <li>Согласование этапов и результата</li>
                <li>Передача проекта и исходного кода</li>
              </ul>
              <Link className="craft-format-link" href="/formats#done-for-you">Условия разработки <span aria-hidden="true">↗</span></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="craft-cta">
        <div className="craft-cta-panel">
          <p className="craft-kicker"><span className="craft-kicker-dot" /> 07 / ТВОЙ СЛЕДУЮЩИЙ ШАГ</p>
          <h2>Идея заслуживает<br /><em>первой версии.</em></h2>
          <p>Приходи с готовой задумкой или просто с интересом к технологиям. Начнём с задачи и разберёмся, что действительно стоит создать.</p>
          <div className="craft-hero-actions">
            <Link className="craft-button" href="/register">Начать с CRAFT <span aria-hidden="true">↗</span></Link>
            <Link className="craft-button craft-button-quiet" href="/directions">Изучить направления <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <footer className="craft-footer">
        <Link className="craft-brand" href="/" aria-label="CRAFT — главная">CRAFT<span>®</span></Link>
        <p>ШКОЛА СОЗДАНИЯ ЦИФРОВЫХ ПРОДУКТОВ</p>
        <span>© 2026 CRAFT. Создавай осмысленно.</span>
      </footer>
    </main>
  );
}
