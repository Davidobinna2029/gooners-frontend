import Image from "next/image";
import parse from "html-react-parser";

import { getPostBySlug, getPosts } from "@/lib/api/wordpress";
import {
  mapWordPressPost,
  mapWordPressPosts,
} from "@/lib/mappers/wordpressMapper";

import ArticleMeta from "@/components/news/ArticleMeta";
import ShareBar from "@/components/news/ShareBar";
import RelatedPosts from "@/components/news/RelatedPosts";
import AuthorBox from "@/components/news/AuthorBox";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * =========================
 * METADATA
 * =========================
 */
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return {
      title: "Article Not Found | ArsenalTalks",
      description: "The requested article could not be found.",
    };
  }

  const post = mapWordPressPost(rawPost);

  return {
    title: `${post.title} | ArsenalTalks`,
    description: post.excerpt?.slice(0, 150) || "Latest Arsenal news",
    openGraph: {
      title: post.title,
      description: post.excerpt?.slice(0, 150),
      images: post.image?.url ? [{ url: post.image.url }] : [],
    },
  };
}

/**
 * =========================
 * CONTENT CLEANER (FINAL FIX)
 * =========================
 * HARD REMOVAL OF ALL IMAGE SOURCES
 */
function cleanContent(html: string): string {
  if (!html) return "";

  return html
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, "")
    .trim();
}

/**
 * =========================
 * PAGE
 * =========================
 */
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">Article Not Found</h1>
        <p className="mt-4 text-gray-400">
          This article may have been removed or URL is incorrect.
        </p>
      </div>
    );
  }

  const rawLatest = await getPosts();
  const post = mapWordPressPost(rawPost);
  const latest = mapWordPressPosts(rawLatest || []);

  const imageUrl = post.image?.url;

  /**
   * CLEAN BODY CONTENT (NO IMAGES EVER)
   */
  const articleContent = cleanContent(
    rawPost.content?.rendered || ""
  );

  return (
    <article className="article-page py-8">
      <div className="container max-w-[480px] md:max-w-[800px] mx-auto px-4">

        {/* HEADER */}
        <header className="article-header mb-8">
          <span className="article-category uppercase text-red-500 text-sm">
            Arsenal
          </span>

          <h1 className="text-3xl md:text-5xl font-bold mt-3">
            {post.title}
          </h1>

          <ArticleMeta date={post.date} />
        </header>

        {/* FEATURED IMAGE (ONLY SOURCE OF IMAGE) */}
        {imageUrl && (
          <div className="mb-10">
            <Image
              src={imageUrl}
              alt={post.title}
              width={1200}
              height={675}
              priority
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="prose max-w-none">
          {parse(articleContent)}
        </div>

        <ShareBar slug={post.slug} title={post.title} />

        <AuthorBox />

        <RelatedPosts
          posts={latest
            .filter((p) => p.id !== post.id)
            .slice(0, 4)}
        />
      </div>
    </article>
  );
}