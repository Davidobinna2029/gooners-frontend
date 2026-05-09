const WORDPRESS_API =
  "https://api.arsenaltalks.com/wp-json/wp/v2";

export async function getPosts() {
  try {
    const res = await fetch(
      `${WORDPRESS_API}/posts?_embed&per_page=10`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    return await res.json();
  } catch (error) {
    console.error("Posts API Error:", error);
    return [];
  }
}

export async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${WORDPRESS_API}/posts?slug=${slug}&_embed`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch single post");
    }

    const data = await res.json();

    return data[0];
  } catch (error) {
    console.error("Single Post Error:", error);
    return null;
  }
}

export async function getCategoryPosts(
  slug: string
) {
  try {
    const categoryRes = await fetch(
      `${WORDPRESS_API}/categories?slug=${slug}`,
      {
        next: { revalidate: 60 },
      }
    );

    const categoryData =
      await categoryRes.json();

    const category = categoryData[0];

    if (!category) return [];

    const postsRes = await fetch(
      `${WORDPRESS_API}/posts?categories=${category.id}&_embed`,
      {
        next: { revalidate: 60 },
      }
    );

    return await postsRes.json();
  } catch (error) {
    console.error(
      "Category Posts Error:",
      error
    );

    return [];
  }
}