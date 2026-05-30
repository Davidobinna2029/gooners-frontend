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
   * =========================
   * DEBUG LAYER (CRITICAL)
   * =========================
   */
  console.log("RAW POSTS SAMPLE:", rawPosts?.[0]);
  console.log("RAW EMBED SAMPLE:", rawPosts?.[0]?._embedded);

  /**
   * SAFE NORMALIZATION LAYER
   */
  const posts = mapWordPressPosts(rawPosts ?? []);

  console.log("MAPPED POSTS SAMPLE:", posts?.[0]);

  /**
   * FEED ORCHESTRATION
   */
  const feed = buildHomepageFeed(posts);

  console.log("HERO IMAGE SAMPLE:", feed.hero?.[0]?.image);

  /**
   * MATCH SAFETY GUARD
   */
  const liveMatch =
    Array.isArray(scores) && scores.length > 0
      ? scores[0]
      : null;

  return (
    <main className="home-page">

      <StickyScoreStrip matches={scores ?? []} />

      <section className="hero-zone">
        <Hero featured={feed.hero ?? []} />
      </section>

      <section className="breaking-zone">
        <BreakingSwiper posts={feed.breaking ?? []} />
      </section>

      <section className="match-zone">
        <MatchHero nextMatch={liveMatch} />
      </section>

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

      <section className="featured-zone">
        <FeaturedGrid posts={feed.featured ?? []} />
      </section>

    </main>
  );
}