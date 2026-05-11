const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2";

async function fetchAPI(
  endpoint: string
) {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `WordPress API Error: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(
      "WordPress Fetch Error:",
      error
    );

    return [];
  }
}

/* =========================================
   FORMAT POST
========================================= */
function formatPost(post: any) {
  return {
    ...post,

    featuredImage:
      post?._embedded?.[
        "wp:featuredmedia"
      ]?.[0]?.source_url ||
      "/fallback.jpg",
  };
}

/* =========================================
   GET POSTS
========================================= */
export async function getPosts(
  page = 1
) {
  const posts = await fetchAPI(
    `/posts?_embed&per_page=10&page=${page}`
  );

  return posts.map(formatPost);
}

/* =========================================
   GET POST BY SLUG
========================================= */
export async function getPostBySlug(
  slug: string
) {
  const posts = await fetchAPI(
    `/posts?_embed&slug=${slug}`
  );

  if (!posts.length) {
    return null;
  }

  return formatPost(posts[0]);
}

/* =========================================
   GET CATEGORIES
========================================= */
export async function getCategories() {
  return fetchAPI(
    "/categories?per_page=20"
  );
}

/* =========================================
   GET POSTS BY CATEGORY
========================================= */
export async function getPostsByCategory(
  slug: string,
  page = 1
) {
  const categories =
    await fetchAPI(
      `/categories?slug=${slug}`
    );

  if (!categories.length) {
    return [];
  }

  const categoryId =
    categories[0].id;

  const posts = await fetchAPI(
    `/posts?_embed&categories=${categoryId}&per_page=10&page=${page}`
  );

  return posts.map(formatPost);
}