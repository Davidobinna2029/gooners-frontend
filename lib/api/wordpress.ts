import { WordPressPost } from "@/types/wordpress";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_URL missing");
}

export async function getPosts(page = 1): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${API_URL}/wp-json/wp/v2/posts?_embed&per_page=12&page=${page}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const posts = await response.json();
    return posts.map(formatPost);
  } catch (error) {
    console.error("WordPress Posts Error:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${API_URL}/wp-json/wp/v2/posts?_embed&slug=${slug}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const posts = await response.json();
    if (!posts.length) {
      return null;
    }

    return formatPost(posts[0]);
  } catch (error) {
    console.error("Single Post Error:", error);
    return null;
  }
}

export async function getCategoryPosts(slug: string): Promise<WordPressPost[]> {
  try {
    const categoryResponse = await fetch(
      `${API_URL}/wp-json/wp/v2/categories?slug=${slug}`,
      {
        next: { revalidate: 300 },
      }
    );

    const categoryData = await categoryResponse.json();
    if (!categoryData.length) {
      return [];
    }

    const categoryId = categoryData[0].id;

    const postsResponse = await fetch(
      `${API_URL}/wp-json/wp/v2/posts?_embed&categories=${categoryId}&per_page=12`,
      {
        next: { revalidate: 60 },
      }
    );

    const posts = await postsResponse.json();
    return posts.map(formatPost);
  } catch (error) {
    console.error("Category Posts Error:", error);
    return [];
  }
}

function formatPost(post: any): WordPressPost {
  return {
    id: post?.id || 0,
    slug: post?.slug || "",
    date: post?.date || "",
    title: post?.title || { rendered: "" },
    excerpt: post?.excerpt || { rendered: "" },
    content: post?.content || { rendered: "" },
    featuredImage:
      post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "/images/placeholder.jpg",
    category:
      post?._embedded?.["wp:term"]?.[0]?.[0]?.name || "Arsenal", // ✅ singular
    author: post?._embedded?.author?.[0]?.name || "ArsenalTalks",
  };
}