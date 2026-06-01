export const revalidate = 30;

import Hero from "@/components/home/Hero";
import BreakingSwiper from "@/components/home/BreakingSwiper";
import MatchHero from "@/components/home/MatchHero";
import StickyScoreStrip from "@/components/layout/StickyScoreStrip";

import { getPosts, getScores } from "@/lib/api/wordpress";
import { mapWordPressPosts } from "@/lib/mappers/wordpressMapper";
import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

/**
 * =========================
 * SAFE FETCH ENGINE
 * =========================
 */
async function safeFetch<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

/**
 * =========================
 * HOME PAGE (ESPN CORE LAYOUT)
 * =========================
 */
export default async function HomePage() {
  const [rawPosts, scores] = await Promise.all([
    safeFetch(getPosts(), []),
    safeFetch(getScores(), []),
  ]);

  /**
   * NORMALIZATION LAYER
   */
  const posts = mapWordPressPosts(rawPosts);

  /**
   * ESPN BRAIN ENGINE OUTPUT
   */
  const feed = buildHomepageFeed(posts);

  /**
   * LIVE MATCH SAFETY
   */
  const liveMatch = scores?.[0] ?? null;

  return (
    <main className="home-page">

      {/* =========================
          LIVE SCORE STRIP (ALWAYS ON TOP)
      ========================= */}
      <StickyScoreStrip matches={scores} />

      {/* =========================
          HERO (DISCOVER PRIMARY ENGINE)
          - Injury + Match + Transfers priority handled inside feed engine
      ========================= */}
      {feed.hero?.length > 0 && (
        <section className="hero-zone">
          <Hero featured={feed.hero} />
        </section>
      )}

      {/* =========================
          BREAKING (HIGH FRESHNESS SIGNAL)
      ========================= */}
      {feed.breaking?.length > 0 && (
        <section className="breaking-zone">
          <BreakingSwiper posts={feed.breaking} />
        </section>
      )}

      {/* =========================
          MATCH CENTER (REAL-TIME HOOK)
      ========================= */}
      <section className="match-zone">
        <MatchHero nextMatch={liveMatch} />
      </section>

    </main>
  );
}