import type { NormalizedPost } from "@/lib/mappers/wordpressMapper";

/**
 * =========================
 * GOOGLE DISCOVER PRIORITIZER
 * =========================
 */
export function rankForDiscover(posts: NormalizedPost[]): NormalizedPost[] {
  if (!Array.isArray(posts)) return [];

  const now = Date.now();

  return [...posts]
    .map((post) => {
      const ageHours =
        (now - new Date(post.date).getTime()) / (1000 * 60 * 60);

      let score = 0;

      /**
       * =========================
       * 1. FRESHNESS BOOST (CRITICAL)
       * =========================
       */
      if (ageHours <= 2) score += 120;
      else if (ageHours <= 6) score += 90;
      else if (ageHours <= 24) score += 60;
      else if (ageHours <= 72) score += 30;

      /**
       * =========================
       * 2. CONTENT QUALITY SIGNALS
       * =========================
       */
      if (post.image) score += 25;
      if (post.excerpt && post.excerpt.length > 80) score += 15;
      if (post.categories?.length) score += 10;

      /**
       * =========================
       * 3. SEO ENGAGEMENT SIGNAL (SIMULATED)
       * =========================
       */
      const titleLength = post.title.length;

      if (titleLength >= 40 && titleLength <= 80) {
        score += 20; // optimal Discover title range
      }

      if (post.title.toLowerCase().includes("arsenal")) {
        score += 15; // niche authority boost
      }

      /**
       * =========================
       * FINAL SCORE
       * =========================
       */
      return {
        ...post,
        score,
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}