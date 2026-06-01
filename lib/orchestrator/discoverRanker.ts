import type { CanonicalPost } from "@/types/content";

/**
 * =========================
 * GOOGLE DISCOVER PRIORITIZER (ESPN LAYER)
 * =========================
 */

export function rankForDiscover(posts: CanonicalPost[]): CanonicalPost[] {
  if (!Array.isArray(posts)) return [];

  const now = Date.now();

  return [...posts]
    .map((post) => {
      const ageHours =
        (now - new Date(post.date).getTime()) / (1000 * 60 * 60);

      let score = 0;

      /**
       * =========================
       * 1. FRESHNESS BOOST
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
      if (post.image) score += 25; // ✅ string check only
      if (post.excerpt && post.excerpt.length > 80) score += 15;
      if (post.categories?.length) score += 10;

      /**
       * =========================
       * 3. SEO SIGNALS
       * =========================
       */
      const titleLength = post.title.length;

      if (titleLength >= 40 && titleLength <= 80) {
        score += 20;
      }

      if (post.title.toLowerCase().includes("arsenal")) {
        score += 15;
      }

      return {
        ...post,
        score,
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}