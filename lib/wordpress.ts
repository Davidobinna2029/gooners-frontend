const API_URL =
  process.env.WORDPRESS_API_URL;

export async function getPosts(
  page = 1
) {
  try {
    const res = await fetch(
      `${API_URL}/posts?_embed&per_page=10&page=${page}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    const posts = await res.json();

    return posts.map(
      formatPost
    );
  } catch (error) {
    console.log(error);

    return [];
  }
}

export async function getFeaturedPosts() {
  try {
    const res = await fetch(
      `${API_URL}/posts?_embed&per_page=5`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    const posts = await res.json();

    return posts.map(
      formatPost
    );
  } catch (error) {
    console.log(error);

    return [];
  }
}

export async function getCategories() {
  try {
    const res = await fetch(
      `${API_URL}/categories?per_page=20`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.log(error);

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
        cache: "no-store",
      }
    );

    const cats =
      await catRes.json();

    if (!cats.length) {
      return [];
    }

    const categoryId =
      cats[0].id;

    const postRes = await fetch(
      `${API_URL}/posts?_embed&categories=${categoryId}&per_page=20`,
      {
        cache: "no-store",
      }
    );

    if (!postRes.ok) {
      return [];
    }

    const posts =
      await postRes.json();

    return posts.map(
      formatPost
    );
  } catch (error) {
    console.log(error);

    return [];
  }
}

export async function getPostBySlug(
  slug: string
) {
  try {
    const res = await fetch(
      `${API_URL}/posts?_embed&slug=${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const posts =
      await res.json();

    if (!posts.length) {
      return null;
    }

    return formatPost(
      posts[0]
    );
  } catch (error) {
    console.log(error);

    return null;
  }
}

function formatPost(
  post: any
) {
  return {
    ...post,

    featuredImage:
      post?._embedded?.[
        "wp:featuredmedia"
      ]?.[0]?.source_url ||
      "/fallback.jpg",
  };
}