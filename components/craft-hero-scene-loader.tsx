"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(
  () => import("./craft-hero-scene").then((module) => module.CraftHeroScene),
  { ssr: false, loading: () => <div className="craft-scene craft-scene-fallback" aria-hidden="true" /> },
);

export function CraftHeroScene() {
  return <Scene />;
}
