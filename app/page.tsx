import Header from "@/components/layout/Header";

import Hero from "@/components/home/Hero";

import FeaturedGrid from "@/components/home/FeaturedGrid";

import CategoryRail from "@/components/home/CategoryRail";

import TrendingList from "@/components/home/TrendingList";

import BreakingTicker from "@/components/home/BreakingTicker";

import VideoHighlights from "@/components/home/VideoHighlights";

import LiveScores from "@/components/sports/LiveScores";

import StickyScoreStrip from "@/components/sports/StickyScoreStrip";

import Standings from "@/components/sports/Standings";

import NextMatch from "@/components/sports/NextMatch";

import { getPosts } from "@/lib/wordpress";

import {
  getLiveMatches,
  getStandings,
  getNextMatch,
  getUCLMatches,
} from "@/lib/sports";

import { buildHomepage } from "@/lib/orchestrator/homepage";

/**
 * SEO
 */
export const metadata = {
  title:
    "ArsenalTalks - Arsenal News, Transfers & Live Football",

  description:
    "Latest Arsenal news, transfer updates, live scores, standings and Champions League coverage.",
};

/**
 * PAGE
 */
export default async function HomePage() {
  /**
   * CONTENT
   */
  const posts =
    await getPosts();

  /**
   * SPORTS
   */
  const liveMatches =
    await getLiveMatches();

  const standings =
    await getStandings();

  const nextMatch =
    await getNextMatch();

  const uclMatches =
    await getUCLMatches();

  /**
   * HOMEPAGE ORCHESTRATION
   */
  const homepage =
    buildHomepage(posts);

  return (
    <>
      {/* HEADER */}
      <Header />

      {/* STICKY SCORES */}
      <StickyScoreStrip
        matches={liveMatches}
      />

      {/* BREAKING TICKER */}
      <BreakingTicker
        posts={homepage.trending.slice(
          0,
          5
        )}
      />

      <main className="homepage">
        {/* HERO */}
        <Hero
          post={homepage.hero}
        />

        {/* FEATURED */}
        <FeaturedGrid
          posts={homepage.featured}
        />

        {/* LIVE SCORES */}
        <LiveScores
          matches={liveMatches}
        />

        {/* TRANSFER NEWS */}
        <CategoryRail
          title="Transfer News"
          posts={
            homepage.rails
              .transferNews
          }
        />

        {/* INJURY NEWS */}
        <CategoryRail
          title="Injury News"
          posts={
            homepage.rails
              .injuryNews
          }
        />

        {/* UCL NEWS */}
        <CategoryRail
          title="Champions League"
          posts={
            homepage.rails.uclNews
          }
        />

        {/* UCL MATCHES */}
        <LiveScores
          matches={uclMatches}
        />

        {/* VIDEO */}
        <VideoHighlights />

        {/* TRENDING */}
        <TrendingList
          posts={
            homepage.trending
          }
        />

        {/* FOOTBALL WIDGETS */}
        <section className="sports-widgets">
          <Standings
            table={standings}
          />

          <NextMatch
            match={nextMatch}
          />
        </section>
      </main>
    </>
  );
}