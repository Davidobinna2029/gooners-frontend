import type { MetadataRoute } from "next";

import sitemapPosts from "@/generated/sitemap-posts.json";

const SITE_URL = "https://arsenaltalks.com";

type SitemapPost = {
  slug: string;
  date: string | null;
  modified: string | null;
};

/**
 * ArsenalTalks sitemap.
 *
 * WordPress post data is generated during the build by:
 *
 * scripts/generate-legacy-redirects.mjs
 *
 * This keeps sitemap generation local and prevents another
 * WordPress API crawl during `next build`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * Public pages and verified WordPress categories.
   */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },

    /*
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

    /*
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

    /*
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

  /*
   * Published WordPress articles.
   *
   * The generated JSON is populated before `next build`
   * starts, so this section performs no network request.
   */

  const posts =
    sitemapPosts as SitemapPost[];

  const articleUrls: MetadataRoute.Sitemap =
    posts
      .filter(
        (post) =>
          typeof post.slug === "string" &&
          post.slug.trim().length > 0
      )
      .map((post) => ({
        url: `${SITE_URL}/news/${post.slug}`,
        ...(post.modified || post.date
          ? {
              lastModified:
                post.modified || post.date!,
            }
          : {}),
        changeFrequency:
          "weekly" as const,
        priority: 0.7,
      }));

  return [
    ...staticPages,
    ...articleUrls,
  ];
}