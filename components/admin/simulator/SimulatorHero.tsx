"use client";

import SimulatorStory from "./SimulatorStory";

interface Props {
  heroMain: any;
  heroSide: any[];
}

export default function SimulatorHero({
  heroMain,
  heroSide,
}: Props) {
  return (
    <section className="sim-hero-layout">

      {/* MAIN HERO */}

      <div className="sim-main-hero">

        <div className="sim-section-title">
          🟥 MAIN HERO
        </div>

        {heroMain ? (
          <SimulatorStory
            post={heroMain}
          />
        ) : (
          <div className="sim-empty">
            No Main Hero Assigned
          </div>
        )}

      </div>

      {/* SIDE HERO */}

      <div className="sim-side-heroes">

        <div className="sim-section-title">
          🟦 SIDE STORIES
        </div>

        {heroSide?.length ? (
          heroSide.map((post) => (
            <SimulatorStory
              key={post.id}
              post={post}
              compact
            />
          ))
        ) : (
          <div className="sim-empty">
            No Side Stories
          </div>
        )}

      </div>

    </section>
  );
}