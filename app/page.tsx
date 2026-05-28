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
   * STEP 1: SAFE NORMALIZATION (ONLY ONCE)
   */
  const normalizedPosts = mapWordPressPosts(rawPosts ?? []);

  /**
   * STEP 2: SINGLE SOURCE FEED ENGINE
   */
  const feed = buildHomepageFeed(normalizedPosts);

  return (
    <main>
      <StickyScoreStrip matches={scores || []} />

      {/* BREAKING SYSTEM */}
      <BreakingSwiper posts={feed.breaking} />

      {/* HERO */}
      <Hero featured={feed.hero} />

      {/* MATCH MODULE */}
      <MatchHero nextMatch={scores?.[0] ?? null} />

      {/* CONTENT STREAM */}
      <TrendingRail posts={feed.trending} />

      <EditorsPicks posts={feed.editors} />

      <TransferCenter posts={feed.transfer} />

      <FeaturedGrid posts={feed.featured} />
    </main>
  );
}