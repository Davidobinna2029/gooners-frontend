export const revalidate = 30;

import Hero from "@/components/home/Hero";
import FeaturedGrid from "@/components/home/FeaturedGrid";
import BreakingSwiper from "@/components/home/BreakingSwiper";
import TrendingRail from "@/components/home/TrendingRail";
import TransferCenter from "@/components/home/TransferCenter";
import EditorsPicks from "@/components/home/EditorsPicks";
import MatchHero from "@/components/home/MatchHero";
import StickyScoreStrip from "@/components/layout/StickyScoreStrip";

import { getPosts, getScores } from "@/lib/api/wordpress";
import { mapWordPressPosts } from "@/lib/mappers/wordpressMapper";
import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

export default async function HomePage() {
  const [rawPosts, scores] = await Promise.all([
    getPosts().catch(() => []),
    getScores().catch(() => []),
  ]);

  /**
   * SAFE NORMALIZATION LAYER
   */
  const posts = mapWordPressPosts(rawPosts ?? []);

  /**
   * FEED ORCHESTRATION (SINGLE SOURCE OF TRUTH)
   */
  const feed = buildHomepageFeed(posts);

  /**
   * MATCH SAFETY GUARD
   */
  const liveMatch = Array.isArray(scores) && scores.length > 0
    ? scores[0]
    : null;

  return (
    <main className="home-page">

      {/* =========================
          1. LIVE SCORE STRIP
      ========================= */}
      <StickyScoreStrip matches={scores ?? []} />

      {/* =========================
          2. HERO SECTION
      ========================= */}
      <section className="hero-zone">
        <Hero featured={feed.hero ?? []} />
      </section>

      {/* =========================
          3. BREAKING NEWS
      ========================= */}
      <section className="breaking-zone">
        <BreakingSwiper posts={feed.breaking ?? []} />
      </section>

      {/* =========================
          4. MATCH HERO
      ========================= */}
      <section className="match-zone">
        <MatchHero nextMatch={liveMatch} />
      </section>

      {/* =========================
          5. CONTENT GRID
      ========================= */}
      <section className="content-grid-zone">
        <div className="container grid-3col">

          <div className="col">
            <TrendingRail posts={feed.trending ?? []} />
          </div>

          <div className="col">
            <EditorsPicks posts={feed.editors ?? []} />
          </div>

          <div className="col">
            <TransferCenter posts={feed.transfer ?? []} />
          </div>

        </div>
      </section>

      {/* =========================
          6. FEATURED ARCHIVE
      ========================= */}
      <section className="featured-zone">
        <FeaturedGrid posts={feed.featured ?? []} />
      </section>

    </main>
  );
}