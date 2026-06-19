import { wpFetch } from "./core/wpFetch";

export async function getLatestPosts(perPage = 12) {
  return wpFetch<any[]>(
    `/posts?_embed=1&per_page=${perPage}&orderby=date&order=desc`,
    {
      revalidate: 60,
    }
  );
}

export async function getPostBySlug(slug: string) {
  const posts = await wpFetch<any[]>(
    `/posts?slug=${slug}&_embed=1`,
    {
      revalidate: 300,
    }
  );

  return posts[0] ?? null;
}

export async function getPostById(id: number) {
  return wpFetch<any>(
    `/posts/${id}?_embed=1`,
    {
      revalidate: 300,
    }
  );
}

export async function getRelatedPosts(
  categoryId: number,
  excludeId: number,
  perPage = 4
) {
  return wpFetch<any[]>(
    `/posts?categories=${categoryId}&exclude=${excludeId}&_embed=1&per_page=${perPage}`,
    {
      revalidate: 300,
    }
  );
}

export async function getRecentPosts(perPage = 5) {
  return wpFetch<any[]>(
    `/posts?_embed=1&per_page=${perPage}`,
    {
      revalidate: 60,
    }
  );
}