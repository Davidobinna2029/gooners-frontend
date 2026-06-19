import { wpFetch } from "./core/wpFetch";

export async function getCategories() {
  return wpFetch<any[]>(
    "/categories?per_page=100&orderby=count&order=desc",
    {
      revalidate: 300,
    }
  );
}

export async function getCategoryBySlug(slug: string) {
  const categories = await wpFetch<any[]>(
    `/categories?slug=${slug}`,
    {
      revalidate: 300,
    }
  );

  return categories[0] ?? null;
}

export async function getPostsByCategory(
  categoryId: number,
  perPage = 8
) {
  return wpFetch<any[]>(
    `/posts?categories=${categoryId}&_embed=1&per_page=${perPage}&orderby=date&order=desc`,
    {
      revalidate: 60,
    }
  );
}

export async function getCategoryFeed(
  slug: string,
  perPage = 8
) {
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      category: null,
      posts: [],
    };
  }

  const posts = await getPostsByCategory(
    category.id,
    perPage
  );

  return {
    category,
    posts,
  };
}