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

/**
 * =========================
 * SAFE FETCH
 * =========================
 */
async function safeFetch<T>(
  promise: Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  /**
   * =========================
   * FETCH DATA
   * =========================
   */
  const [rawPosts, scores] = await Promise.all([
    safeFetch(getPosts(), []),
    safeFetch(getScores(), []),
  ]);

  /**
   * =========================
   * NORMALIZE POSTS
   * =========================
   */
  const posts = mapWordPressPosts(rawPosts);

  /**
   * =========================
   * BUILD FEED
   * =========================
   */
  const feed = buildHomepageFeed(posts);

  /**
   * =========================
   * LIVE MATCH
   * =========================
   */
  const liveMatch = scores?.[0] ?? null;

  return (
    <main className="home-page">

      {/* SCORE STRIP */}
      <StickyScoreStrip matches={scores} />

      {/* HERO */}
      {feed.hero?.length > 0 && (
        <section className="hero-zone">
          <Hero featured={feed.hero} />
        </section>
      )}

      {/* BREAKING NEWS */}
      {feed.breaking?.length > 0 && (
        <section className="breaking-zone">
          <BreakingSwiper posts={feed.breaking} />
        </section>
      )}

      {/* MATCH CENTER */}
      <section className="match-zone">
        <MatchHero nextMatch={liveMatch} />
      </section>

      {/* MAIN CONTENT */}
      <section className="content-grid-zone">
        <div className="container grid-3col">

          <div className="col">
            {feed.trending?.length > 0 && (
              <TrendingRail posts={feed.trending} />
            )}
          </div>

          <div className="col">
            {feed.editors?.length > 0 && (
              <EditorsPicks posts={feed.editors} />
            )}
          </div>

          <div className="col">
            {feed.transfer?.length > 0 && (
              <TransferCenter posts={feed.transfer} />
            )}
          </div>

        </div>
      </section>

      {/* FEATURED STORIES */}
      {feed.featured?.length > 0 && (
        <section className="featured-zone">
          <FeaturedGrid posts={feed.featured} />
        </section>
      )}

    </main>
  );
}