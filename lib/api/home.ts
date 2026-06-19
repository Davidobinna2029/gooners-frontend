import { getLatestPosts } from "./posts";
import {
  getCategories,
  getPostsByCategory,
} from "./categories";

export async function getHomePageData() {
  const latestPosts = await getLatestPosts(15);

  const hero = latestPosts[0] ?? null;

  const latest = latestPosts.slice(1, 5);

  const trending = latestPosts.slice(5, 10);

  const allCategories = await getCategories();

  const homepageCategories = allCategories
    .filter((category: any) => category.count > 0)
    .slice(0, 4);

  const categorySections = await Promise.all(
    homepageCategories.map(async (category: any) => {
      const posts = await getPostsByCategory(
        category.id,
        4
      );

      return {
        category,
        posts,
      };
    })
  );

  return {
    hero,
    latest,
    trending,
    categorySections,
  };
}