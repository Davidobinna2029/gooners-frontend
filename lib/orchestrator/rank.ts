// lib/orchestrator/rank.ts
export function rankPosts(posts: any[]) {
  return [...posts].sort((a, b) => {
    const scoreA = calculateScore(a);
    const scoreB = calculateScore(b);
    return scoreB - scoreA;
  });
}

function calculateScore(post: any) {
  let score = 0;

  if (post.meta?.isBreaking) score += 100;
  if (post.meta?.isTransfer) score += 50;
  if (post.meta?.isUCL) score += 40;
  if (post.meta?.isOpinion) score -= 10;

  return score;
}