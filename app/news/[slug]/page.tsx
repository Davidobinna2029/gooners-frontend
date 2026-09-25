import type { Metadata } from "next";
import Image from "next/image";
import parse from "html-react-parser";

import {
  getPostBySlug,
  getPosts,
} from "@/lib/api/wordpress";

import {
  mapWordPressPost,
  mapWordPressPosts,
} from "@/lib/mappers/wordpressMapper";

import ArticleMeta from "@/components/news/ArticleMeta";
import ShareBar from "@/components/news/ShareBar";
import AuthorBox from "@/components/news/AuthorBox";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

/*
 * IMPORTANT:
 * WordPress is the headless backend.
 *
 * Public article URLs MUST always use:
 * https://arsenaltalks.com/news/[slug]
 *
 * Never use the WordPress API domain for:
 * - canonical URLs
 * - Open Graph URLs
 * - Twitter URLs
 * - JSON-LD article URLs
 * - public article links
 */
const SITE_URL = "https://arsenaltalks.com";
const SITE_NAME = "ArsenalTalks";

const DEFAULT_DESCRIPTION =
  "Latest Arsenal news, transfer updates, match reports, injury news and more from ArsenalTalks.";

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function limitText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}…`;
}

/*
 * Remove an existing ArsenalTalks suffix because
 * app/layout.tsx already applies:
 *
 * %s | ArsenalTalks
 *
 * This prevents:
 *
 * Article Title - ArsenalTalks | ArsenalTalks
 */
function removeSiteNameSuffix(value: string): string {
  return value
    .replace(
      /\s*[-|]\s*ArsenalTalks\s*$/i,
      ""
    )
    .trim();
}

function getSeoTitle(
  rawPost: any,
  fallbackTitle: string
): string {
  const yoastTitle =
    rawPost?.arsenaltalks_seo?.title ||
    rawPost?.meta?._yoast_wpseo_title ||
    rawPost?.yoast_head_json?.title ||
    "";

  const cleaned = cleanText(yoastTitle);

  if (cleaned) {
    return removeSiteNameSuffix(cleaned);
  }

  return fallbackTitle.trim();
}

function getSeoDescription(
  rawPost: any,
  fallbackExcerpt: string
): string {
  const yoastDescription =
    rawPost?.arsenaltalks_seo?.description ||
    rawPost?.meta?._yoast_wpseo_metadesc ||
    rawPost?.yoast_head_json?.description ||
    "";

  const cleanedYoastDescription =
    cleanText(yoastDescription);

  if (cleanedYoastDescription) {
    return limitText(cleanedYoastDescription, 160);
  }

  const cleanedExcerpt =
    cleanText(fallbackExcerpt);

  if (cleanedExcerpt) {
    return limitText(cleanedExcerpt, 160);
  }

  return DEFAULT_DESCRIPTION;
}

function getFocusKeyphrase(rawPost: any): string {
  return cleanText(
    rawPost?.arsenaltalks_seo?.focuskw ||
      rawPost?.meta?._yoast_wpseo_focuskw ||
      ""
  );
}

/*
 * PUBLIC ARTICLE URL
 *
 * This function intentionally does NOT use:
 * - NEXT_PUBLIC_WORDPRESS_API_URL
 * - WordPress post.link
 * - rawPost.link
 * - API hostnames
 */
function getArticleUrl(slug: string): string {
  return `${SITE_URL}/news/${slug}`;
}

function getAuthorName(rawPost: any): string {
  const embeddedAuthor =
    rawPost?._embedded?.author?.[0]?.name;

  if (
    typeof embeddedAuthor === "string" &&
    embeddedAuthor.trim()
  ) {
    return embeddedAuthor.trim();
  }

  return SITE_NAME;
}

function getCategoryName(rawPost: any): string {
  const terms =
    rawPost?._embedded?.["wp:term"] || [];

  for (const taxonomyGroup of terms) {
    if (!Array.isArray(taxonomyGroup)) {
      continue;
    }

    for (const term of taxonomyGroup) {
      if (
        term?.taxonomy === "category" &&
        typeof term?.name === "string"
      ) {
        return term.name;
      }
    }
  }

  return "Arsenal";
}

/* ============================================================
   METADATA
============================================================ */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return {
      title: "Article Not Found",
      description:
        "The requested article could not be found.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const post = mapWordPressPost(rawPost);

  const articleSlug =
    post.slug || slug;

  const articleUrl =
    getArticleUrl(articleSlug);

  const seoTitle =
    getSeoTitle(
      rawPost,
      post.title
    );

  const seoDescription =
    getSeoDescription(
      rawPost,
      post.excerpt || ""
    );

  const imageUrl =
    post.image?.url || null;

  const publishedTime =
    post.date || undefined;

  const modifiedTime =
    rawPost?.modified || publishedTime;

  const authorName =
    getAuthorName(rawPost);

  const categoryName =
    getCategoryName(rawPost);

  const focusKeyphrase =
    getFocusKeyphrase(rawPost);

  return {
    /*
     * app/layout.tsx adds:
     *
     * %s | ArsenalTalks
     *
     * Therefore seoTitle must NOT already contain
     * "- ArsenalTalks".
     */
    title: seoTitle,

    description: seoDescription,

    keywords: focusKeyphrase
      ? [focusKeyphrase]
      : undefined,

    authors: [
      {
        name: authorName,
      },
    ],

    creator: authorName,

    publisher: SITE_NAME,

    metadataBase: new URL(SITE_URL),

    alternates: {
      canonical: articleUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "article",

      locale: "en_GB",

      /*
       * CRITICAL:
       * This is the public article URL.
       */
      url: articleUrl,

      siteName: SITE_NAME,

      title: seoTitle,

      description: seoDescription,

      publishedTime,

      modifiedTime,

      authors: [authorName],

      section: categoryName,

      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 675,
              alt: post.title,
            },
          ]
        : [],
    },

    twitter: {
      card: imageUrl
        ? "summary_large_image"
        : "summary",

      title: seoTitle,

      description: seoDescription,

      images: imageUrl
        ? [imageUrl]
        : undefined,
    },

    other: {
      "article:section": categoryName,
    },
  };
}

/* ============================================================
   ARTICLE PAGE
============================================================ */

export default async function ArticlePage({
  params,
}: Props) {
  const { slug } = await params;

  const rawPost =
    await getPostBySlug(slug);

  if (!rawPost) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">
          Article Not Found
        </h1>

        <p className="mt-4 text-gray-400">
          This article may have been removed or
          the URL is incorrect.
        </p>
      </div>
    );
  }

  const rawLatest =
    await getPosts();

  const post =
    mapWordPressPost(rawPost);

  mapWordPressPosts(
    rawLatest || []
  );

  /*
   * PUBLIC ARTICLE URL
   *
   * Never use rawPost.link here.
   */
  const articleSlug =
    post.slug || slug;

  const articleUrl =
    getArticleUrl(articleSlug);

  const imageUrl =
    post.image?.url || null;

  const seoDescription =
    getSeoDescription(
      rawPost,
      post.excerpt || ""
    );

  const authorName =
    getAuthorName(rawPost);

  const categoryName =
    getCategoryName(rawPost);

  const publishedTime =
    post.date || undefined;

  const modifiedTime =
    rawPost?.modified || publishedTime;

  /* ==========================================================
     ARTICLE CONTENT
  ========================================================== */

  let articleContent =
    rawPost.content?.rendered ||
    "<p>No content available.</p>";

  /*
   * Remove the featured image from the article body
   * because it is already displayed separately above
   * the article content.
   */
  if (imageUrl) {
    const escapedUrl =
      imageUrl.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    articleContent =
      articleContent
        .replace(
          new RegExp(
            `<img[^>]*src=["']${escapedUrl}["'][^>]*>`,
            "gi"
          ),
          ""
        )
        .replace(
          /<figure[^>]*>[\s\S]*?<\/figure>/gi,
          ""
        );
  }

  /* ==========================================================
     JSON-LD
  ========================================================== */

  const structuredData = {
    "@context": "https://schema.org",

    "@type": "NewsArticle",

    headline: post.title,

    description: seoDescription,

    /*
     * CRITICAL:
     * Public ArsenalTalks article URL.
     */
    url: articleUrl,

    mainEntityOfPage: {
      "@type": "WebPage",

      /*
       * CRITICAL:
       * Public ArsenalTalks article URL.
       */
      "@id": articleUrl,
    },

    datePublished: publishedTime,

    dateModified: modifiedTime,

    author: {
      "@type": "Person",

      name: authorName,
    },

    publisher: {
      "@type": "Organization",

      name: SITE_NAME,

      url: SITE_URL,
    },

    articleSection: categoryName,

    isPartOf: {
      "@type": "NewsMediaOrganization",

      name: SITE_NAME,

      url: SITE_URL,
    },

    ...(imageUrl
      ? {
          image: [
            {
              "@type": "ImageObject",

              /*
               * Image URL can correctly remain
               * on the WordPress media domain.
               */
              url: imageUrl,

              width: 1200,

              height: 675,
            },
          ],
        }
      : {}),
  };

  return (
    <article className="article-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData
            ),
        }}
      />

      <div className="container max-w-[480px] md:max-w-[800px] mx-auto px-4">
        <header className="article-header mb-8">
          <span className="article-category uppercase tracking-widest text-red-500 text-sm font-medium">
            {categoryName}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mt-3">
            {post.title}
          </h1>

          <ArticleMeta
            date={post.date}
          />
        </header>

        {imageUrl && (
          <div className="article-featured-image mb-10 -mx-4 md:mx-0">
            <Image
              src={imageUrl}
              alt={post.title}
              width={1200}
              height={675}
              priority
              className="article-image w-full h-auto rounded-2xl object-cover"
            />
          </div>
        )}

        <div className="article-layout flex flex-col lg:flex-row gap-10">
          <main className="article-main flex-1 min-w-0">
            <div className="article-body prose prose-base md:prose-lg max-w-none">
              {parse(articleContent)}
            </div>

            <ShareBar
              slug={articleSlug}
              title={post.title}
            />

            <AuthorBox />
          </main>

          <aside className="article-sidebar w-full lg:w-80 hidden lg:block">
            {/* Sidebar content */}
          </aside>
        </div>
      </div>
    </article>
  );
}