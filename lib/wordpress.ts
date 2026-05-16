import { fetchWordPress } from "./api/wordpressClient";

/**
 * ALL POSTS
 */
export async function getPosts() {
  const data = await fetchWordPress(
    "/posts?_embed&per_page=20"
  );

  if (!data) return [];

  return data.map(formatPost);
}

/**
 * SINGLE POST
 */
export async function getPost(
  slug: string
) {
  const data = await fetchWordPress(
    `/posts?_embed&slug=${slug}`
  );

  if (!data?.length) {
    return null;
  }

  return formatPost(data[0]);
}

/**
 * CATEGORY POSTS
 */
export async function getCategoryPosts(
  slug: string
) {
  const category =
    await fetchWordPress(
      `/categories?slug=${slug}`
    );

  if (!category?.length) {
    return [];
  }

  const categoryId =
    category[0].id;

  const posts =
    await fetchWordPress(
      `/posts?_embed&categories=${categoryId}&per_page=10`
    );

  if (!posts) {
    return [];
  }

  return posts.map(formatPost);
}

/**
 * NORMALIZER
 */
function formatPost(post: any) {
  return {
    id: post.id,

    slug: post.slug,

    title:
      post.title?.rendered || "",

    excerpt:
      post.excerpt?.rendered || "",

    content:
      post.content?.rendered || "",

    date: post.date,

    featuredImage:
      post?._embedded?.[
        "wp:featuredmedia"
      ]?.[0]?.source_url || null,

    categories:
      post?._embedded?.[
        "wp:term"
      ]?.flat?.() || [],

    author:
      post?._embedded?.author?.[0]
        ?.name || "ArsenalTalks",
  };
}