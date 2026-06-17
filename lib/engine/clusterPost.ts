import type { CanonicalPost } from "@/types/content";

/**
 * =========================
 * POST CLUSTERS (ESPN STYLE TAXONOMY)
 * =========================
 */
export type PostCluster =
  | "arsenal"
  | "transfers"
  | "injury"
  | "match"
  | "other";

/**
 * =========================
 * WEIGHTED INTELLIGENCE MAP
 * =========================
 */
const CLUSTER_KEYWORDS: Record<
  PostCluster,
  { key: string; weight: number }[]
> = {
  arsenal: [
    { key: "arsenal", weight: 3 },
    { key: "arteta", weight: 3 },
    { key: "odegaard", weight: 2 },
    { key: "saka", weight: 2 },
    { key: "gunners", weight: 2 },
  ],

  transfers: [
    { key: "transfer", weight: 3 },
    { key: "signing", weight: 2 },
    { key: "bid", weight: 2 },
    { key: "deal", weight: 2 },
    { key: "target", weight: 1 },
  ],

  injury: [
    { key: "injury", weight: 3 },
    { key: "setback", weight: 2 },
    { key: "sidelined", weight: 2 },
    { key: "recovery", weight: 2 },
    { key: "fitness", weight: 1 },
  ],

  match: [
    { key: "vs", weight: 2 },
    { key: "fixture", weight: 2 },
    { key: "lineup", weight: 2 },
    { key: "kick-off", weight: 2 },
    { key: "premier league", weight: 3 },
    { key: "champions league", weight: 3 },
    { key: "match", weight: 2 },
  ],

  other: [],
};

/**
 * =========================
 * TEXT NORMALIZER
 * =========================
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * =========================
 * CLUSTER SCORING ENGINE
 * =========================
 */
function scoreCluster(
  text: string,
  keywords: { key: string; weight: number }[]
): number {
  let score = 0;

  for (const { key, weight } of keywords) {
    if (text.includes(key)) {
      score += weight;
    }
  }

  return score;
}

/**
 * =========================
 * CLUSTER DETECTOR (ESPN INTELLIGENCE)
 * =========================
 */
export function detectCluster(post: CanonicalPost): PostCluster {
  const text = normalize(`${post.title} ${post.excerpt}`);

  let bestCluster: PostCluster = "other";
  let bestScore = 0;

  for (const cluster of Object.keys(CLUSTER_KEYWORDS) as PostCluster[]) {
    if (cluster === "other") continue;

    const score = scoreCluster(text, CLUSTER_KEYWORDS[cluster]);

    if (score > bestScore) {
      bestScore = score;
      bestCluster = cluster;
    }
  }

  return bestCluster;
}

/**
 * =========================
 * CLUSTER POSTS (IMMUTABLE VERSION)
 * =========================
 */
export function clusterPosts(posts: CanonicalPost[]) {
  const clusters: Record<PostCluster, CanonicalPost[]> = {
    arsenal: [],
    transfers: [],
    injury: [],
    match: [],
    other: [],
  };

  for (const post of posts) {
    const cluster = detectCluster(post);

    /**
     * 🔥 CRITICAL FIX:
     * Clone object to prevent shared reference bugs across feed engine
     */
    clusters[cluster].push(structuredClone(post));
  }

  return clusters;
}

/**
 * =========================
 * PRIORITY SORTING (IMMUTABLE)
 * =========================
 */
export function boostCluster(posts: CanonicalPost[]) {
  return [...posts].sort((a, b) => {
    return (b.score ?? 0) - (a.score ?? 0);
  });
}