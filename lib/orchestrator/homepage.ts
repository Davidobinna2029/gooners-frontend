
import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

/**
 * Homepage scoring engine (PURE logic only)
 */
function calculateScore(post: NormalizedPost) {
  let score = 0;

  // RECENCY BOOST
  const published = new Date(post.date).getTime();
  const now = Date.now();

  const hoursOld =
    (now - published) / (1000 * 60 * 60);

  if (hoursOld < 3) {
    score += 50;
  } else if (hoursOld < 12) {
    score += 35;
  } else if (hoursOld < 24) {
    score += 20;
  }

  // CATEGORY BOOST (safe array-based)
  const categories = post.categories || [];

  if (categories.length > 0) {
    // optional: extend later with category mapping table
    score += 5;
  }

  // TITLE BOOST
  const title =
    post.title?.toLowerCase?.() || "";

  if (title.includes("confirmed")) {
    score += 18;
  }

  if (title.includes("agreement")) {
    score += 14;
  }

  if (title.includes("done deal")) {
    score += 20;
  }

  if (title.includes("breaking")) {
    score += 25;
  }

  return score;
}

/**
 * Add ranking metadata ONLY (no reshaping)
 */
function enrichPost(post: NormalizedPost) {
  return {
    ...post,
    score: calculateScore(post),
  };
}

/**
 * Main homepage ranking pipeline
 */
export function rankHomepagePosts(
  posts: NormalizedPost[]
) {
  if (!Array.isArray(posts)) {
    return [];
  }

  return posts
    .map(enrichPost)
    .sort((a, b) => (b.score || 0) - (a.score || 0));
}