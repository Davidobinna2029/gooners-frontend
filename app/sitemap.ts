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

async function getAllPublishedPosts(): Promise<
  WordPressSitemapPost[]
> {
  const posts: WordPressSitemapPost[] = [];

  const perPage = 100;
  let page = 1;

  while (true) {
    const response = await fetch(
      `${WP_API}/posts?per_page=${perPage}&page=${page}&status=publish&_fields=slug,date,modified`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

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

    if (!batch.length) {
      break;
    }

    posts.push(...batch);

    if (batch.length < perPage) {
      break;
    }

    page += 1;
  }

  return posts;
}

export default async function sitemap(): Promise<
  MetadataRoute.Sitemap
> {
  const posts = await getAllPublishedPosts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },

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

    {
      url: `${SITE_URL}/category/match-reports`,
      changeFrequency: "daily",
      priority: 0.8,
    },

    {
      url: `${SITE_URL}/category/women`,
      changeFrequency: "daily",
      priority: 0.7,
    },

    {
      url: `${SITE_URL}/category/opinion`,
      changeFrequency: "daily",
      priority: 0.7,
    },

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

  const articleUrls: MetadataRoute.Sitemap =
    posts
      .filter((post) => post.slug)
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