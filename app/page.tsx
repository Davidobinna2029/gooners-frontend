export const revalidate = 30;

import Hero from "@/components/home/Hero";
import MatchHero from "@/components/home/MatchHero";
import StickyScoreStrip from "@/components/layout/StickyScoreStrip";

import { getPosts, getScores } from "@/lib/api/wordpress";
import { mapWordPressPosts } from "@/lib/mappers/wordpressMapper";
import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

async function safeFetch<T>(p: Promise<T>, f: T): Promise<T> {
  try {
    return await p;
  } catch {
    return f;
  }
}

export default async function HomePage() {
  const [rawPosts, scores] = await Promise.all([
    safeFetch(getPosts(), []),
    safeFetch(getScores(), []),
  ]);

  const posts = mapWordPressPosts(
    Array.isArray(rawPosts) ? rawPosts : []
  );

  const feed = buildHomepageFeed(posts);
  const liveMatch = scores?.[0] ?? null;

  /**
   * CLEAN LIMITING LAYER (IMPORTANT)
   */
  const hero = feed.hero?.slice(0, 3);

  return (
    <main className="home-page">

      {/* LIVE STRIP (ONLY SIGNAL LAYER) */}
      <StickyScoreStrip matches={scores} />

      {/* HERO (PRIMARY CONTENT ONLY) */}
      {hero?.length > 0 && (
        <section className="hero-zone">
          <Hero featured={hero} />
        </section>
      )}

      {/* MATCH (ONLY IF EXISTS) */}
      {liveMatch && (
        <section className="match-zone">
          <MatchHero nextMatch={liveMatch} />
        </section>
      )}

    </main>
  );
}