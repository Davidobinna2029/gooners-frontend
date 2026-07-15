"use client";

import HeroCanvas from "./HeroCanvas";
import BreakingCanvas from "./BreakingCanvas";
import TrendingCanvas from "./TrendingCanvas";
import LatestCanvas from "./LatestCanvas";

export default function HomepageCanvas() {
  return (
    <section className="designer-canvas">
      <HeroCanvas />

      <BreakingCanvas />

      <TrendingCanvas />

      <LatestCanvas />
    </section>
  );
}