import type { CanonicalPost } from "./ingestPosts";

const WEIGHTS = {
  freshness: 0.5,
  keyword: 0.3,
  category: 0.2,
};

const KEYWORDS = [
  "arsenal",
  "arteta",
  "odegaard",
  "saka",
  "transfer",
  "injury",
  "deal",
  "champions league",
  "premier league",
];

function freshness(date: string): number {
  const diff = (Date.now() - new Date(date).getTime()) / 36e5;

  if (diff < 1) return 100;
  if (diff < 6) return 90;
  if (diff < 24) return 70;
  if (diff < 72) return 40;

  return 10;
}

function keyword(text: string): number {
  let score = 0;

  for (const k of KEYWORDS) {
    if (text.toLowerCase().includes(k)) score += 10;
  }

  return Math.min(score, 100);
}

function categoryBoost(categories: number[]): number {
  return categories.length * 5;
}

export function scorePost(post: CanonicalPost): number {
  const text = `${post.title} ${post.excerpt}`;

  const score =
    freshness(post.date) * WEIGHTS.freshness +
    keyword(text) * WEIGHTS.keyword +
    categoryBoost(post.categories) * WEIGHTS.category;

  return Math.round(score);
}

export function rankForDiscover(posts: CanonicalPost[]) {
  return [...posts]
    .map(p => ({
      ...p,
      score: scorePost(p),
    }))
    .sort((a, b) => b.score - a.score);
}