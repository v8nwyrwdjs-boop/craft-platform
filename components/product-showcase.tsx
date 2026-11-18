"use client";

import { useEffect, useState } from "react";

const products = [
  {
    number: "01",
    category: "БЛОКЧЕЙН И WEB3",
    title: "Собственная криптовалюта",
    description: "Разберись, как устроены токены и смарт-контракты, и создай учебный токен в тестовой сети — от идеи и токеномики до проверки безопасности.",
    outcome: "Учебный токен и понимание его устройства",
    visual: "coin",
    tag: "Для тех, кто хочет разобраться в Web3",
  },
  {
    number: "02",
    category: "ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ",
    title: "Собственный ИИ-продукт",
    description: "Научись работать с языковыми моделями, данными и API. Собери интеллектуальное приложение, которое решает конкретную задачу.",
    outcome: "Рабочий прототип ИИ-приложения",
    visual: "ai",
    tag: "От первого запроса до приложения",
  },
  {
    number: "03",
    category: "РАЗРАБОТКА С ИИ",
    title: "Программирование с ИИ",
    description: "Преврати идею в сайт или приложение с помощью современных ИИ-инструментов. Пойми логику кода, научись проверять результат и исправлять ошибки.",
    outcome: "Собственный сайт или приложение",
    visual: "code",
    tag: "Можно начать без опыта в коде",
  },
  {
    number: "04",
    category: "ЦИФРОВОЙ БИЗНЕС",
    title: "Свой SaaS-сервис",
    description: "Найди проблему, за которую готовы платить, спроектируй сервис по подписке, собери первую версию и подготовь её к проверке рынком.",
    outcome: "Первая версия сервиса и план запуска",
    visual: "saas",
    tag: "От гипотезы до первых пользователей",
  },
  {
    number: "05",
    category: "ИИ И АВТОМАТИЗАЦИЯ",
    title: "Команда ИИ-агентов",
    description: "Создай агентов, которые используют инструменты, обмениваются данными и выполняют последовательности задач под твоим контролем.",
    outcome: "Рабочий сценарий автоматизации",
    visual: "agents",
    tag: "Практика на реальных процессах",
  },
];

export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % products.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const product = products[active];

  return (
    <section
      className="showcase-section"
      id="products"
      aria-label="Идеи будущих программ CRAFT"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="wrap">
        <div className="showcase-heading">
          <div>
            <p className="eyebrow">01 / ЧТО МОЖНО СОЗДАТЬ</p>
            <h2>Большие идеи.<br /><em>Реальные проекты.</em></h2>
          </div>
          <p>Это направления будущих практических программ. Выбирай идею — путь от основ до собственного проекта пройдём вместе.</p>
        </div>

        <div className="showcase-stage">
          <div className="showcase-copy">
            <div className="showcase-meta"><span>{product.category}</span><span>{product.number} / 0{products.length}</span></div>
            <p className="showcase-tag">{product.tag}</p>
            <h3 key={product.title}>{product.title}</h3>
            <p className="showcase-description">{product.description}</p>
            <div className="showcase-outcome"><span>ЧТО СОЗДАДИМ</span><b>{product.outcome}</b></div>
            <div className="showcase-controls">
              <div className="showcase-dots" aria-label="Выбрать идею">
                {products.map((item, index) => (
                  <button
                    key={item.number}
                    className={index === active ? "is-active" : ""}
                    onClick={() => setActive(index)}
                    aria-label={`Показать идею: ${item.title}`}
                    aria-pressed={index === active}
                  />
                ))}
              </div>
              <div className="showcase-arrows">
                <button onClick={() => setActive((active - 1 + products.length) % products.length)} aria-label="Предыдущая идея">←</button>
                <button onClick={() => setActive((active + 1) % products.length)} aria-label="Следующая идея">→</button>
              </div>
            </div>
          </div>
          <div className={`showcase-art art-${product.visual}`} key={product.visual} aria-hidden="true">
            <div className="art-grid" />
            {product.visual === "coin" && <><div className="coin-ring ring-a" /><div className="coin-ring ring-b" /><div className="coin-core">C</div><span className="art-caption">ТОКЕН / ТЕСТОВАЯ СЕТЬ</span></>}
            {product.visual === "ai" && <><div className="ai-orbit orbit-a" /><div className="ai-orbit orbit-b" /><div className="ai-core">AI</div>{Array.from({length:8},(_,i)=><i className={`ai-node node-${i+1}`} key={i}/>) }<span className="art-caption">МОДЕЛЬ / 001</span></>}
            {product.visual === "code" && <><div className="code-window"><div className="code-top"><i/><i/><i/></div><span>01&nbsp; const idea = "craft";</span><span>02&nbsp; build(idea);</span><span>03&nbsp; launch(product);</span><b>✓ ГОТОВО К ПРОВЕРКЕ</b></div><span className="art-caption">СОЗДАТЬ / ПРОВЕРИТЬ / ЗАПУСТИТЬ</span></>}
            {product.visual === "saas" && <><div className="saas-panel"><div className="saas-line wide"/><div className="saas-line"/><div className="saas-bars"><i/><i/><i/><i/><i/><i/><i/></div><div className="saas-bottom"><i/><i/><i/></div></div><span className="art-caption">ПРОДУКТ / ПАНЕЛЬ</span></>}
            {product.visual === "agents" && <><div className="agent-hub">ЦЕЛЬ</div><div className="agent-node agent-one">АНАЛИЗ</div><div className="agent-node agent-two">ПОИСК</div><div className="agent-node agent-three">ДЕЙСТВИЕ</div><div className="agent-link link-one"/><div className="agent-link link-two"/><div className="agent-link link-three"/><span className="art-caption">АГЕНТЫ / СЦЕНАРИЙ</span></>}
          </div>
        </div>
        <div className="showcase-footnote"><span>КОНЦЕПЦИИ ДЛЯ БУДУЩИХ ПРОГРАММ</span><span>Прокрутка автоматически · Наведи курсор, чтобы остановить</span></div>
      </div>
    </section>
  );
}
