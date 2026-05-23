export function rankTrending(posts: any[]) {
  if (!posts) return [];

  return [...posts]
    .sort((a, b) => {
      const scoreA =
        (a?.acf?.views || 0) +
        new Date(a.date).getTime() / 1000000;

      const scoreB =
        (b?.acf?.views || 0) +
        new Date(b.date).getTime() / 1000000;

      return scoreB - scoreA;
    })
    .slice(0, 10);
}