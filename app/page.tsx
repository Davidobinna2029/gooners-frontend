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

  const hero = feed.hero?.slice(0, 3);

  /**
   * =========================
   * 🔍 DEBUG LOGS (TEMP ONLY)
   * =========================
   */
  console.log("🟡 RAW POSTS[0]:", rawPosts?.[0]);
  console.log("🟢 MAPPED POSTS[0]:", posts?.[0]);
  console.log("🔵 HERO[0]:", hero?.[0]);
  console.log("🟣 HERO IMAGE URL:", hero?.[0]?.image?.url);

  return (
    <main className="home-page">

      {/* LIVE STRIP */}
      <StickyScoreStrip matches={scores} />

      {/* HERO */}
      {hero?.length > 0 && (
        <section className="hero-zone">
          <Hero featured={hero} />
        </section>
      )}

      {/* MATCH */}
      {liveMatch && (
        <section className="match-zone">
          <MatchHero nextMatch={liveMatch} />
        </section>
      )}

    </main>
  );
}