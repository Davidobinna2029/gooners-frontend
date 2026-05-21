import { WordPressPost } from "@/types/wordpress";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL missing");
}

export async function getPosts(page = 1): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${API_URL}/posts?_embed&per_page=12&page=${page}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      console.error("WordPress Posts Error:", response.status, response.statusText);
      return [];
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.error("Invalid response type:", contentType);
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
      `${API_URL}/posts?_embed&slug=${slug}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      console.error("Single Post Error:", response.status, response.statusText);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.error("Invalid response type:", contentType);
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
      `${API_URL}/categories?slug=${slug}`,
      { next: { revalidate: 300 } }
    );

    if (!categoryResponse.ok) {
      console.error("Category Fetch Error:", categoryResponse.status, categoryResponse.statusText);
      return [];
    }

    const contentType = categoryResponse.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.error("Invalid category response type:", contentType);
      return [];
    }

    const categoryData = await categoryResponse.json();
    if (!categoryData.length) {
      return [];
    }

    const categoryId = categoryData[0].id;

    const postsResponse = await fetch(
      `${API_URL}/posts?_embed&categories=${categoryId}&per_page=12`,
      { next: { revalidate: 60 } }
    );

    if (!postsResponse.ok) {
      console.error("Category Posts Error:", postsResponse.status, postsResponse.statusText);
      return [];
    }

    const postsContentType = postsResponse.headers.get("content-type");
    if (!postsContentType?.includes("application/json")) {
      console.error("Invalid posts response type:", postsContentType);
      return [];
    }

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
      post?._embedded?.["wp:term"]?.[0]?.[0]?.name || "Arsenal",
    author: post?._embedded?.author?.[0]?.name || "ArsenalTalks",
  };
}