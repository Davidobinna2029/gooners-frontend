import type { MetadataRoute } from "next";

const SITE_URL = "https://arsenaltalks.com";

const WP_API =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2";

type WordPressSitemapPost = {
  slug: string;
  date: string;
  modified: string;
};

/**
 * Fetch all published WordPress posts for the sitemap.
 */
async function getAllPublishedPosts(): Promise<
  WordPressSitemapPost[]
> {
  const posts: WordPressSitemapPost[] = [];

  const perPage = 100;
  let page = 1;

  while (true) {
    const url =
      `${WP_API}/posts` +
      `?per_page=${perPage}` +
      `&page=${page}` +
      `&status=publish` +
      `&orderby=date` +
      `&order=desc` +
      `&_fields=slug,date,modified`;

    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });

    /**
     * WordPress returns 400 when the requested page
     * is beyond the available pagination range.
     */
    if (response.status === 400) {
      break;
    }

    if (!response.ok) {
      throw new Error(
        `WordPress sitemap request failed: ${response.status}`
      );
    }

    const batch =
      (await response.json()) as WordPressSitemapPost[];

    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }

    posts.push(...batch);

    /**
     * If fewer than 100 posts are returned,
     * we have reached the final page.
     */
    if (batch.length < perPage) {
      break;
    }

    page += 1;
  }

  return posts;
}

/**
 * ArsenalTalks sitemap.
 */
export default async function sitemap(): Promise<
  MetadataRoute.Sitemap
> {
  const posts = await getAllPublishedPosts();

  /**
   * Public pages and real WordPress categories.
   *
   * Categories verified against the ArsenalTalks
   * WordPress taxonomy.
   */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },

    /**
     * Main Arsenal categories
     */
    {
      url: `${SITE_URL}/category/arsenal`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/transfer-news`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/injury-news`,
      changeFrequency: "hourly",
      priority: 0.8,
    },

    /**
     * Additional verified categories
     */
    {
      url: `${SITE_URL}/category/women`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/category/academy`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/category/loan-watch`,
      changeFrequency: "daily",
      priority: 0.6,
    },

    /**
     * Important site pages
     */
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/legal/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/legal/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/legal/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  /**
   * Published WordPress articles.
   */
  const articleUrls: MetadataRoute.Sitemap = posts
    .filter(
      (post) =>
        typeof post.slug === "string" &&
        post.slug.trim().length > 0
    )
    .map((post) => ({
      url: `${SITE_URL}/news/${post.slug}`,
      lastModified:
        post.modified || post.date,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [
    ...staticPages,
    ...articleUrls,
  ];
}