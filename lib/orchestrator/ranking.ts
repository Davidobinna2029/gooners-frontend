export function rankPosts(posts: any[]) {
  return [...posts].sort(
    (a, b) => {
      const scoreA =
        calculateScore(a);

      const scoreB =
        calculateScore(b);

      return scoreB - scoreA;
    }
  );
}

function calculateScore(post: any) {
  let score = 0;

  /**
   * BREAKING BOOST
   */
  if (post.meta?.isBreaking) {
    score += 100;
  }

  /**
   * TRANSFER BOOST
   */
  if (post.meta?.isTransfer) {
    score += 50;
  }

  /**
   * UCL BOOST
   */
  if (post.meta?.isUCL) {
    score += 40;
  }

  /**
   * OPINION REDUCTION
   */
  if (post.meta?.isOpinion) {
    score -= 10;
  }

  return score;
}