const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_WORDPRESS_API is missing"
  );
}

export async function getPosts(
  page = 1
) {
  try {
    const res = await fetch(
      `${API_URL}/posts?_embed&per_page=10&page=${page}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch posts`
      );
    }

    return res.json();
  } catch (error) {
    console.error(
      "WordPress Posts Error:",
      error
    );

    return [];
  }
}

export async function getPost(
  slug: string
) {
  try {
    const res = await fetch(
      `${API_URL}/posts?slug=${slug}&_embed`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch post"
      );
    }

    const data = await res.json();

    return data[0];
  } catch (error) {
    console.error(
      "Single Post Error:",
      error
    );

    return null;
  }
}

export async function getCategories() {
  try {
    const res = await fetch(
      `${API_URL}/categories?per_page=20`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch categories"
      );
    }

    return res.json();
  } catch (error) {
    console.error(
      "Categories Error:",
      error
    );

    return [];
  }
}

export async function getCategoryPosts(
  slug: string
) {
  try {
    const catRes = await fetch(
      `${API_URL}/categories?slug=${slug}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    const cats = await catRes.json();

    if (!cats.length) {
      return [];
    }

    const categoryId = cats[0].id;

    const postRes = await fetch(
      `${API_URL}/posts?categories=${categoryId}&_embed&per_page=12`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    return postRes.json();
  } catch (error) {
    console.error(
      "Category Posts Error:",
      error
    );

    return [];
  }
}