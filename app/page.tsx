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
import { rankHomepagePosts } from "@/lib/orchestrator/homepage";

export default async function HomePage() {
  const rawPosts = await getPosts().catch(() => []);
  const scores = await getScores().catch(() => []);

  const normalizedPosts = mapWordPressPosts(rawPosts ?? []);
  const posts = rankHomepagePosts(normalizedPosts);

  const heroPosts = posts.slice(0, 4);
  const featuredPosts = posts.slice(4);
  const trendingPosts = posts.slice(0, 10);
  const editorPosts = posts.slice(2, 8);

  const transferPosts = posts.filter(
    (p) => (p.title || "").toLowerCase().includes("transfer")
  );

  return (
    <main>
      <StickyScoreStrip matches={scores} />
      <BreakingTicker posts={posts} />
      <Hero featured={heroPosts} />
      <MatchHero nextMatch={scores?.[0]} />
      <TrendingRail posts={trendingPosts} />
      <EditorsPicks posts={editorPosts} />
      <TransferCenter posts={transferPosts} />
      <FeaturedGrid posts={featuredPosts} />
    </main>
  );
}