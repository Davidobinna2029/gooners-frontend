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
 * SAFE IMAGE RESOLVER (CRITICAL FIX)
 * =========================
 */
function resolveImage(image: unknown): string {
  if (typeof image === "string" && image.length > 5) {
    return image;
  }
  return "/fallback.jpg";
}

/**
 * SEO Metadata
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

  const image = resolveImage(post.image);

  return {
    title: `${post.title} | ArsenalTalks`,
    description: post.excerpt?.slice(0, 150) || "Latest Arsenal news",

    openGraph: {
      title: post.title,
      description: post.excerpt?.slice(0, 150) || "Latest Arsenal news",
      images: [
        {
          url: image,
        },
      ],
    },
  };
}

/**
 * Article Page
 */
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const rawPost = await getPostBySlug(slug);
  const rawLatest = await getPosts();

  if (!rawPost) {
    return (
      <div className="container">
        <div style={{ padding: "80px 0" }}>
          <h1>Article not found</h1>
          <p>
            This article may have been removed or the URL is incorrect.
          </p>
        </div>
      </div>
    );
  }

  const post = mapWordPressPost(rawPost);
  const latest = mapWordPressPosts(rawLatest || []);

  const articleContent =
    rawPost?.content?.rendered || "<p>No article content.</p>";

  const imageSrc = resolveImage(post.image);

  return (
    <article className="article-page">
      <div className="container">

        {/* HEADER */}
        <header className="article-header">
          <span className="article-category">Arsenal</span>

          <h1>{post.title}</h1>

          <ArticleMeta date={post.date} />
        </header>

        {/* FEATURED IMAGE (FIXED TYPE SAFE) */}
        <div className="article-image">
          <Image
            src={imageSrc}
            alt={post.title || "Arsenal news"}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* ARTICLE LAYOUT */}
        <div className="article-layout">

          {/* SHARE SIDEBAR */}
          <aside className="article-sidebar">
            <ShareBar slug={post.slug} title={post.title} />
          </aside>

          {/* ARTICLE CONTENT */}
          <main className="article-main">
            <div className="article-body">
              {parse(articleContent)}
            </div>

            <AuthorBox />

            <RelatedPosts
              posts={latest
                .filter((item) => item.id !== post.id)
                .slice(0, 4)}
            />
          </main>

        </div>
      </div>
    </article>
  );
}