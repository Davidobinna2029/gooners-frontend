import Hero from "@/components/home/Hero";

import FeaturedGrid from "@/components/home/FeaturedGrid";

import BreakingTicker from "@/components/home/BreakingTicker";

import TrendingRail from "@/components/home/TrendingRail";

import TransferCenter from "@/components/home/TransferCenter";

import EditorsPicks from "@/components/home/EditorsPicks";

import MatchHero from "@/components/home/MatchHero";

import StickyScoreStrip from "@/components/layout/StickyScoreStrip";

import {
  getPosts,
} from "@/lib/api/wordpress";

import {
  rankHomepagePosts,
} from "@/lib/orchestrator/homepage";

async function getScores() {

  try {

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/scores`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    return response.json();

  } catch {

    return [];

  }

}

export default async function HomePage() {

  const rawPosts =
    await getPosts();

  const posts =
    rankHomepagePosts(
      rawPosts
    );

  const scores =
    await getScores();

  return (
    <main>

      <StickyScoreStrip
        matches={scores}
      />

      <BreakingTicker
        posts={posts}
      />

      <Hero
        featured={posts.slice(0, 4)}
      />

      <MatchHero
        nextMatch={scores?.[0]}
      />

      <TrendingRail
        posts={posts}
      />

      <EditorsPicks
        posts={posts}
      />

      <TransferCenter
        posts={posts}
      />

      <FeaturedGrid
        posts={posts.slice(4)}
      />

    </main>
  );
}