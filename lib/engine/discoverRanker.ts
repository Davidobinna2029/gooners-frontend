import type { CanonicalPost } from "@/types/content";

/**
 * =========================
 * WEIGHT CONFIG (DISCOVER MODEL)
 * =========================
 */
const WEIGHTS = {
  freshness: 0.45,
  keyword: 0.25,
  engagement: 0.15,
  categoryBoost: 0.15,
};

/**
 * =========================
 * HIGH-VALUE KEYWORDS (WEIGHTED)
 * =========================
 */
const HIGH_VALUE_KEYWORDS: Record<string, number> = {
  arsenal: 12,
  arteta: 10,
  saka: 10,
  odegaard: 10,

  transfer: 12,
  signing: 10,
  deal: 8,

  injury: 12,
  setback: 9,

  "champions league": 11,
  "premier league": 10,
};

/**
 * =========================
 * CATEGORY BOOST (ESPN SAFE DEFAULT)
 * =========================
 */
function getCategoryBoost(categories: number[]): number {
  if (!Array.isArray(categories) || categories.length === 0) return 0;

  // baseline editorial boost (no WP dependency locking)
  return 10;
}

/**
 * =========================
 * FRESHNESS ENGINE (ESPN STYLE)
 * =========================
 */
function getFreshnessScore(date: string): number {
  const now = Date.now();
  const postTime = new Date(date).getTime();

  const hoursOld = (now - postTime) / 36e5;

  if (hoursOld < 1) return 100;
  if (hoursOld < 6) return 92;
  if (hoursOld < 12) return 85;
  if (hoursOld < 24) return 75;
  if (hoursOld < 48) return 60;
  if (hoursOld < 72) return 45;

  return 20;
}

/**
 * =========================
 * KEYWORD INTELLIGENCE ENGINE
 * =========================
 */
function getKeywordScore(text: string): number {
  const lower = text.toLowerCase();

  let score = 0;

  for (const [keyword, weight] of Object.entries(HIGH_VALUE_KEYWORDS)) {
    if (lower.includes(keyword)) {
      score += weight;
    }
  }

  return Math.min(score, 100);
}

/**
 * =========================
 * ENGAGEMENT ENGINE (FUTURE READY)
 * =========================
 */
function getEngagementScore(post: CanonicalPost): number {
  const base = 40;

  if (post.title.toLowerCase().includes("arsenal")) {
    return base + 10;
  }

  return base;
}

/**
 * =========================
 * FINAL SCORE ENGINE (ESPN DISCOVER CORE)
 * =========================
 */
export function scorePost(post: CanonicalPost): number {
  const text = `${post.title} ${post.excerpt}`;

  const freshness = getFreshnessScore(post.date);
  const keyword = getKeywordScore(text);
  const engagement = getEngagementScore(post);
  const category = getCategoryBoost(post.categories);

  const finalScore =
    freshness * WEIGHTS.freshness +
    keyword * WEIGHTS.keyword +
    engagement * WEIGHTS.engagement +
    category * WEIGHTS.categoryBoost;

  return Math.round(finalScore);
}

/**
 * =========================
 * DISCOVER RANKER (ESPN FEED CORE)
 * =========================
 */
export function rankForDiscover(posts: CanonicalPost[]): CanonicalPost[] {
  return posts
    .map((post) => ({
      ...post,
      score: scorePost(post),
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}