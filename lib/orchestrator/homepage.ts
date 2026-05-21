import { WordPressPost } from "@/types/wordpress";

function calculateScore(post: WordPressPost) {
  let score = 0;

  // RECENCY BOOST
  const published = new Date(post.date).getTime();
  const now = Date.now();
  const hoursOld = (now - published) / (1000 * 60 * 60);

  if (hoursOld < 3) {
    score += 50;
  } else if (hoursOld < 12) {
    score += 35;
  } else if (hoursOld < 24) {
    score += 20;
  }

  // CATEGORY BOOST
  const category = post.category?.toLowerCase(); // ✅ singular

  if (category?.includes("transfer")) {
    score += 25;
  }

  if (category?.includes("champions")) {
    score += 20;
  }

  if (category?.includes("breaking")) {
    score += 40;
  }

  if (category?.includes("exclusive")) {
    score += 35;
  }

  // TITLE BOOST
  const title = post.title.rendered.toLowerCase();

  if (title.includes("confirmed")) {
    score += 18;
  }

  if (title.includes("agreement")) {
    score += 14;
  }

  if (title.includes("done deal")) {
    score += 20;
  }

  return score;
}

export function rankHomepagePosts(posts: WordPressPost[]) {
  return posts.sort((a, b) => {
    return calculateScore(b) - calculateScore(a);
  });
}