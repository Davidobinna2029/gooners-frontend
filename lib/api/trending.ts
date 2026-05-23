// lib/api/trending.ts

import { getPosts } from "./wordpress";

export async function getTrendingPosts() {
  const posts = await getPosts();

  return (posts || [])
    .sort((a: any, b: any) => {
      const aScore =
        (a?.acf?.views || 0) +
        new Date(a.date).getTime() / 1000000;

      const bScore =
        (b?.acf?.views || 0) +
        new Date(b.date).getTime() / 1000000;

      return bScore - aScore;
    })
    .slice(0, 10);
}