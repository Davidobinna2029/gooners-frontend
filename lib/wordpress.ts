const API_URL =
  process.env
    .NEXT_PUBLIC_WORDPRESS_API ||
  "https://api.arsenaltalks.com/wp-json/wp/v2";

async function fetchAPI(
  endpoint: string
) {
  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch API"
    );
  }

  return response.json();
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

/* ===================================
   GET POSTS
=================================== */

export async function getPosts(
  page = 1
) {
  const posts =
    await fetchAPI(
      `/posts?_embed&per_page=10&page=${page}`
    );

  return posts.map(formatPost);
}

/* ===================================
   FEATURED POSTS
=================================== */

export async function getFeaturedPosts() {
  const posts =
    await fetchAPI(
      `/posts?_embed&per_page=5`
    );

  return posts.map(formatPost);
}

/* ===================================
   SINGLE POST
=================================== */

export async function getPostBySlug(
  slug: string
) {
  const posts =
    await fetchAPI(
      `/posts?_embed&slug=${slug}`
    );

  if (!posts.length)
    return null;

  return formatPost(
    posts[0]
  );
}

/* ===================================
   CATEGORIES
=================================== */

export async function getCategories() {
  return fetchAPI(
    `/categories?per_page=20`
  );
}

/* ===================================
   CATEGORY POSTS
=================================== */

export async function getCategoryPosts(
  slug: string
) {
  const categories =
    await fetchAPI(
      `/categories?slug=${slug}`
    );

  if (
    !categories ||
    !categories.length
  ) {
    return [];
  }

  const categoryId =
    categories[0].id;

  const posts =
    await fetchAPI(
      `/posts?_embed&categories=${categoryId}&per_page=20`
    );

  return posts.map(formatPost);
}