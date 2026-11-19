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
    label: "КОД",
    title: "Всё начинается с кода.",
    description: "Нули и единицы — чистый материал. Из них складываются интерфейсы, инструменты и новые способы решать задачи.",
  },
  {
    number: "02",
    label: "КОМПЬЮТЕР",
    title: "Код обретает форму.",
    description: "Идея собирается в понятный интерфейс и первую работающую версию: сайт, приложение или сервис.",
  },
  {
    number: "03",
    label: "ПРОДУКТ",
    title: "Появляется цифровой актив.",
    description: "У продукта появляется собственная логика, данные и сценарий использования. Он начинает решать конкретную задачу для людей.",
  },
  {
    number: "04",
    label: "ЭКОСИСТЕМА",
    title: "От продукта — к системе.",
    description: "Сервисы, AI-агенты, автоматизация и люди соединяются в экосистему, которую можно развивать дальше.",
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
        progressRef.current = 1 / 3;
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
        setActiveChapter(Math.min(3, Math.round(progress * 3)));
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
            <p className="craft-story-index">{chapter.number} <span>/ 04 — {chapter.label}</span></p>
            <h2>{chapter.title}</h2>
            <p className="craft-story-description">{chapter.description}</p>
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
            {reducedMotion ? "История CRAFT — четыре этапа одного пути" : "Прокручивай, чтобы увидеть трансформацию"}
          </p>
        </div>

        <div className="craft-story-visual" aria-hidden="true">
          <div className="craft-story-visual-top"><span>CRAFT / PROCESS STUDY</span><span>FIG. 001—004</span></div>
          {isVisible ? (
            <ScrollScene progressRef={progressRef} invalidateRef={invalidateRef} />
          ) : (
            <div className="craft-story-fallback" />
          )}
          <div className="craft-story-visual-bottom"><span>IDEA → PRODUCT</span><span>SCROLL / 360°</span></div>
        </div>
      </div>

      <ol className="craft-story-archive" aria-label="Этапы создания цифрового продукта">
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
