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

const SITE_NAME = "ArsenalTalks";
const SITE_URL = "https://arsenaltalks.com";

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
    return cleaned;
  }

  return `${fallbackTitle} | ${SITE_NAME}`;
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

  const cleanedExcerpt = cleanText(fallbackExcerpt);

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

function getCanonicalUrl(
  rawPost: any,
  slug: string
): string {
  const yoastCanonical =
    rawPost?.yoast_head_json?.canonical ||
    rawPost?.link ||
    "";

  if (
    typeof yoastCanonical === "string" &&
    yoastCanonical.includes("arsenaltalks.com")
  ) {
    return yoastCanonical.replace(
      /^https?:\/\/(www\.)?arsenaltalks\.com/,
      SITE_URL
    );
  }

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

  return "ArsenalTalks";
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

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return {
      title: "Article Not Found | ArsenalTalks",

      description:
        "The requested article could not be found.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const post = mapWordPressPost(rawPost);

  const seoTitle = getSeoTitle(
    rawPost,
    post.title
  );

  const seoDescription = getSeoDescription(
    rawPost,
    post.excerpt || ""
  );

  const canonicalUrl = getCanonicalUrl(
    rawPost,
    post.slug
  );

  const imageUrl = post.image?.url || null;

  const publishedTime =
    post.date || undefined;

  const modifiedTime =
    publishedTime;

  const authorName =
    getAuthorName(rawPost);

  const categoryName =
    getCategoryName(rawPost);

  const focusKeyphrase =
    getFocusKeyphrase(rawPost);

  return {
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
      canonical: canonicalUrl,
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

      url: canonicalUrl,

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

export default async function ArticlePage({
  params,
}: Props) {
  const { slug } = await params;

  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">
          Article Not Found
        </h1>

        <p className="mt-4 text-gray-400">
          This article may have been removed or the
          URL is incorrect.
        </p>
      </div>
    );
  }

  const rawLatest = await getPosts();

  const post = mapWordPressPost(rawPost);

  // Keep this for now even though RelatedPosts is disabled.
  mapWordPressPosts(rawLatest || []);

  const imageUrl = post.image?.url;

  const seoDescription = getSeoDescription(
    rawPost,
    post.excerpt || ""
  );

  const canonicalUrl = getCanonicalUrl(
    rawPost,
    post.slug
  );

  const authorName =
    getAuthorName(rawPost);

  const categoryName =
    getCategoryName(rawPost);

  const publishedTime =
    post.date || undefined;

  const modifiedTime =
    publishedTime;

  let articleContent =
    rawPost.content?.rendered ||
    "<p>No content available.</p>";

  /*
   * Remove the featured image from the article body
   * when it is already displayed as the main image.
   */
  if (imageUrl) {
    const escapedUrl = imageUrl.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    articleContent = articleContent
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

  /*
   * NewsArticle structured data.
   */
  const structuredData = {
    "@context": "https://schema.org",

    "@type": "NewsArticle",

    headline: post.title,

    description: seoDescription,

    url: canonicalUrl,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
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

      {/* STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData
          ),
        }}
      />

      <div className="container max-w-[480px] md:max-w-[800px] mx-auto px-4">

        {/* HEADER */}
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

        {/* FEATURED IMAGE */}
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

        {/* ARTICLE CONTENT */}
        <div className="article-layout flex flex-col lg:flex-row gap-10">

          <main className="article-main flex-1 min-w-0">

            <div className="article-body prose prose-base md:prose-lg max-w-none">
              {parse(articleContent)}
            </div>

            <ShareBar
              slug={post.slug}
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