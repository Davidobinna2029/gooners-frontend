const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://arsenaltalks.com/wp-json/wp/v2";

function getFeaturedImage(post: any) {
  const media =
    post?._embedded?.["wp:featuredmedia"]?.[0];

  if (
    media?.source_url &&
    media.source_url.startsWith("http")
  ) {
    return media.source_url;
  }

  return null;
}

function formatPost(post: any) {
  return {
    ...post,

    featuredImage:
      getFeaturedImage(post),
  };
}

export async function getPosts(
  page = 1
) {
  const res = await fetch(
    `${API_URL}/posts?_embed&per_page=10&page=${page}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  const posts = await res.json();

  return posts.map(formatPost);
}

export async function getFeaturedPosts() {
  const res = await fetch(
    `${API_URL}/posts?_embed&per_page=5`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  const posts = await res.json();

  return posts.map(formatPost);
}

export async function getPost(
  slug: string
) {
  const res = await fetch(
    `${API_URL}/posts?_embed&slug=${slug}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  const posts = await res.json();

  return formatPost(posts[0]);
}

export async function getCategories() {
  const res = await fetch(
    `${API_URL}/categories?per_page=20`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  return res.json();
}

export async function getCategoryPosts(
  slug: string
) {
  const categories =
    await getCategories();

  const category =
    categories.find(
      (cat: any) =>
        cat.slug === slug
    );

  if (!category) {
    return [];
  }

  const res = await fetch(
    `${API_URL}/posts?_embed&categories=${category.id}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  const posts = await res.json();

  return posts.map(formatPost);
}