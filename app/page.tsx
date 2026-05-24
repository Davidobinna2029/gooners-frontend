export const revalidate = 30;

import Hero from "@/components/home/Hero";
import FeaturedGrid from "@/components/home/FeaturedGrid";
import BreakingTicker from "@/components/home/BreakingTicker";
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

  const normalizedPosts = mapWordPressPosts(rawPosts ?? []);

  /**
   * SINGLE SOURCE OF TRUTH (NO DUPLICATES, NO STACKING)
   */
  const {
    hero,
    breaking,
    trending,
    editors,
    transfer,
    featured,
  } = buildHomepageFeed(normalizedPosts);

  return (
    <main>
      {/* LIVE SCORE STRIP (GLOBAL SINGLE INSTANCE) */}
      <StickyScoreStrip matches={scores} />

      {/* BREAKING SWIPER (ONLY ONE SOURCE) */}
      <BreakingTicker posts={breaking} />

      <Hero featured={hero} />

      <MatchHero nextMatch={scores?.[0]} />

      <TrendingRail posts={trending} />

      <EditorsPicks posts={editors} />

      <TransferCenter posts={transfer} />

      <FeaturedGrid posts={featured} />
    </main>
  );
}