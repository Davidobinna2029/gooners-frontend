import { wpFetch } from "./core/wpFetch";
import { buildPostsQuery } from "./postsQuery";

export async function getLatestPosts(perPage = 12) {
  return wpFetch<any[]>(
    buildPostsQuery({
      perPage,
      orderBy: "date",
      order: "desc",
    }),
    {
      revalidate: 60,
    }
  );
}

export async function getPostBySlug(slug: string) {
  const posts = await wpFetch<any[]>(
    buildPostsQuery({ slug }),
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
    buildPostsQuery({
      category: categoryId,
      exclude: [excludeId],
      perPage,
    }),
    {
      revalidate: 300,
    }
  );
}

export async function getRecentPosts(perPage = 5) {
  return wpFetch<any[]>(
    buildPostsQuery({
      perPage,
      orderBy: "date",
      order: "desc",
    }),
    {
      revalidate: 60,
    }
  );
}