"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ScrollScene = dynamic(
  () => import("./craft-scroll-story-scene").then((module) => module.CraftScrollStoryScene),
  { ssr: false, loading: () => <div className="craft-story-fallback" aria-hidden="true" /> },
);

const chapters = [
  {
    number: "01",
    label: "ПРОГРАММИРОВАНИЕ",
    title: "Всё начинается с кода.",
    description: "Нули и единицы становятся программами. Из алгоритмов и логики рождаются интерфейсы, инструменты и технологии, которые решают реальные задачи.",
  },
  {
    number: "02",
    label: "ЦИФРОВЫЕ ПРОДУКТЫ",
    title: "Код обретает форму.",
    description: "Идея превращается в сайт, приложение или цифровой бизнес: с интерфейсом, собственной логикой и понятной ценностью для людей.",
  },
  {
    number: "03",
    label: "КРИПТОВАЛЮТА",
    title: "Появляется цифровой актив.",
    description: "Блокчейн, криптовалюты, токены и цифровые активы. Разбираемся, как распределённые сети фиксируют операции и позволяют создавать новые экономические модели.",
  },
  {
    number: "04",
    label: "ЭКОСИСТЕМА",
    title: "От продукта — к системе.",
    description: "Сервисы, AI-агенты, автоматизация, данные и люди соединяются в единую цифровую экосистему, которую можно развивать дальше.",
  },
  {
    number: "05",
    label: "КАТАЛОГ CRAFT",
    title: "Выбирай, что создавать.",
    description: "Изучай направления и примеры цифровых продуктов CRAFT. Найди технологию, инструмент или идею для собственного проекта.",
  },
];

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

export function CraftScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const invalidateRef = useRef<(() => void) | null>(null);
  const visibleRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const updateProgress = () => {
      if (reducedMotion) {
        progressRef.current = 0.25;
        setActiveChapter(1);
        invalidateRef.current?.();
        return;
      }

      if (!visibleRef.current) return;
      if (frame) window.cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
        const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel));
        progressRef.current = progress;
        setActiveChapter(Math.min(4, Math.round(progress * 4)));
        invalidateRef.current?.();
      });
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              visibleRef.current = entry.isIntersecting;
              setIsVisible(entry.isIntersecting);
              if (entry.isIntersecting) updateProgress();
            },
            { rootMargin: "220px 0px" },
          );

    if (observer) observer.observe(section);
    else {
      visibleRef.current = true;
      setIsVisible(true);
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      observer?.disconnect();
    };
  }, [reducedMotion]);

  const chapter = chapters[activeChapter];

  return (
    <section
      className="craft-story"
      id="story"
      ref={sectionRef}
      aria-label="Как идея превращается в цифровую экосистему"
    >
      <div className="craft-story-pin">
        <div className="craft-story-copy">
          <p className="craft-kicker"><span className="craft-kicker-dot" /> 01 / ОТ ИДЕИ К ПРОДУКТУ</p>
          <div className="craft-story-active" aria-live="polite" aria-atomic="true">
            <p className="craft-story-index">{chapter.number} <span>/ 05 — {chapter.label}</span></p>
            <h2>{chapter.title}</h2>
            <p className="craft-story-description">{chapter.description}</p>
            {activeChapter === 4 && (
              <a className="craft-text-link craft-story-catalog-link" href="#products">
                Открыть каталог CRAFT <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <div className="craft-story-progress" aria-hidden="true">
            <div className="craft-story-progress-track">
              <span style={{ width: ((activeChapter + 1) / chapters.length) * 100 + "%" }} />
            </div>
            <div className="craft-story-progress-labels">
              {chapters.map((item, index) => (
                <span className={index === activeChapter ? "is-active" : ""} key={item.number}>
                  {item.number}
                </span>
              ))}
            </div>
          </div>
          <p className="craft-story-hint">
            <span className="craft-story-hint-mark">↓</span>
            {reducedMotion ? "История CRAFT — пять этапов одного пути" : "Прокручивай, чтобы увидеть трансформацию"}
          </p>
        </div>

        <div className="craft-story-visual" aria-hidden="true">
          <div className="craft-story-visual-top"><span>CRAFT / PROCESS STUDY</span><span>FIG. 001—005</span></div>
          {isVisible ? (
            <ScrollScene progressRef={progressRef} invalidateRef={invalidateRef} />
          ) : (
            <div className="craft-story-fallback" />
          )}
          <div className="craft-story-visual-bottom"><span>IDEA → PRODUCT</span><span>SCROLL / 360°</span></div>
        </div>
      </div>

      <ol className="craft-story-archive" aria-label="Этапы создания цифрового продукта и цифровой экосистемы">
        {chapters.map((item) => (
          <li key={item.number}>
            <span>{item.number} / {item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
