import { rankForDiscover } from "./discoverRanker";
import type { NormalizedPost } from "@/lib/mappers/wordpressMapper";

export function buildHomepageFeed(posts: NormalizedPost[]) {
  const ranked = rankForDiscover(posts);

  return {
    /**
     * =========================
     * HERO = TOP 5 ONLY
     * =========================
     */
    hero: ranked.slice(0, 5),

    /**
     * =========================
     * BREAKING = HIGH FRESHNESS ONLY
     * =========================
     */
    breaking: ranked.filter(p => (p.score ?? 0) >= 90).slice(0, 8),

    /**
     * =========================
     * TRENDING = BALANCED SIGNALS
     * =========================
     */
    trending: ranked.slice(5, 15),

    /**
     * =========================
     * EDITORS PICKS = MID + HIGH QUALITY
     * =========================
     */
    editors: ranked.filter(p => (p.score ?? 0) >= 60).slice(0, 6),

    /**
     * =========================
     * TRANSFERS = CATEGORY FILTER (optional extend later)
     * =========================
     */
    transfer: ranked.slice(10, 18),

    /**
     * =========================
     * FEATURED GRID = FULL RANGE
     * =========================
     */
    featured: ranked.slice(0, 18),
  };
}