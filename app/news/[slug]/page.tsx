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
import RelatedPosts from "@/components/news/RelatedPosts";
import AuthorBox from "@/components/news/AuthorBox";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * =========================
 * SEO METADATA
 * =========================
 */
export async function generateMetadata({
  params,
}: Props) {
  const { slug } = await params;

  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return {
      title: "Article Not Found | ArsenalTalks",
      description:
        "The requested article could not be found.",
    };
  }

  const post = mapWordPressPost(rawPost);

  return {
    title: `${post.title} | ArsenalTalks`,

    description:
      post.excerpt?.slice(0, 150) ||
      "Latest Arsenal news",

    openGraph: {
      title: post.title,

      description:
        post.excerpt?.slice(0, 150) ||
        "Latest Arsenal news",

      images: post.image?.url
        ? [
            {
              url: post.image.url,
            },
          ]
        : [],
    },
  };
}

/**
 * =========================
 * ARTICLE PAGE
 * =========================
 */
export default async function ArticlePage({
  params,
}: Props) {
  const { slug } = await params;

  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return (
      <div className="container">
        <div style={{ padding: "80px 0" }}>
          <h1>Article Not Found</h1>

          <p>
            This article may have been removed
            or the URL is incorrect.
          </p>
        </div>
      </div>
    );
  }

  const rawLatest = await getPosts();

  const post = mapWordPressPost(rawPost);

  const latest = mapWordPressPosts(
    rawLatest || []
  );

  /**
   * REMOVE ALL ARTICLE BODY IMAGES
   */
  const articleContent = (
    rawPost.content?.rendered ||
    "<p>No article content available.</p>"
  )
    .replace(/<img[^>]*>/gi, "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, "");

  return (
    <article className="article-page">
      <div className="container">

        {/* HEADER */}
        <header className="article-header">
          <span className="article-category">
            Arsenal
          </span>

          <h1>{post.title}</h1>

          <ArticleMeta date={post.date} />
        </header>

        {/* FEATURED IMAGE */}
        {post.image?.url && (
          <div className="article-featured-image">
            <Image
              src={post.image.url}
              alt={post.title}
              width={1200}
              height={675}
              priority
              className="article-image"
            />
          </div>
        )}

        {/* ARTICLE LAYOUT */}
        <div className="article-layout">

          {/* SHARE SIDEBAR */}
          <aside className="article-sidebar">
            <ShareBar
              slug={post.slug}
              title={post.title}
            />
          </aside>

          {/* ARTICLE CONTENT */}
          <main className="article-main">

            <div className="article-body">
              {parse(articleContent)}
            </div>

            <AuthorBox />

            <RelatedPosts
              posts={latest
                .filter(
                  (item) => item.id !== post.id
                )
                .slice(0, 4)}
            />

          </main>

        </div>

      </div>
    </article>
  );
}