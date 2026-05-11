const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API;

if (!API_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_WORDPRESS_API"
  );
}

function stripHtml(
  html: string
) {
  return html
    ?.replace(/<[^>]+>/g, "")
    ?.trim();
}

function repairImageUrl(
  url?: string
) {
  if (!url) {
    return "/fallback.jpg";
  }

  let fixed = url;

  // Fix http images
  fixed = fixed.replace(
    "http://",
    "https://"
  );

  // Fix relative URLs
  if (
    fixed.startsWith("/")
  ) {
    fixed = `https://arsenaltalks.com${fixed}`;
  }

  return fixed;
}

function getFeaturedImage(
  post: any
) {
  const embedded =
    post?._embedded?.[
      "wp:featuredmedia"
    ]?.[0]?.source_url;

  const jetpack =
    post?.jetpack_featured_media_url;

  const ogImage =
    post?.yoast_head_json
      ?.og_image?.[0]?.url;

  return repairImageUrl(
    embedded ||
      jetpack ||
      ogImage ||
      "/fallback.jpg"
  );
}

function normalizePost(
  post: any
) {
  return {
    id: post.id,
    slug: post.slug,

    title: {
      rendered:
        post.title?.rendered ||
        "",
    },

    excerpt: {
      rendered: stripHtml(
        post.excerpt?.rendered ||
          ""
      ),
    },

    content: {
      rendered:
        post.content?.rendered ||
        "",
    },

    featuredImage:
      getFeaturedImage(post),
  };
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
        "Failed to fetch posts"
      );
    }

    const data =
      await res.json();

    return data.map(
      normalizePost
    );
  } catch (error) {
    console.error(error);

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
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch post"
      );
    }

    const data =
      await res.json();

    if (!data.length) {
      return null;
    }

    return normalizePost(
      data[0]
    );
  } catch (error) {
    console.error(error);

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

    return res.json();
  } catch (error) {
    console.error(error);

    return [];
  }
}

export async function getCategoryPosts(
  slug: string
) {
  try {
    const categoryRes =
      await fetch(
        `${API_URL}/categories?slug=${slug}`,
        {
          next: {
            revalidate: 3600,
          },
        }
      );

    const categories =
      await categoryRes.json();

    if (
      !categories.length
    ) {
      return [];
    }

    const categoryId =
      categories[0].id;

    const postsRes =
      await fetch(
        `${API_URL}/posts?categories=${categoryId}&_embed&per_page=20`,
        {
          next: {
            revalidate: 60,
          },
        }
      );

    const posts =
      await postsRes.json();

    return posts.map(
      normalizePost
    );
  } catch (error) {
    console.error(error);

    return [];
  }
}