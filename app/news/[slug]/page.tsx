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
      description: post.excerpt?.slice(0, 150) || "Latest Arsenal news",
      images: post.image?.url ? [{ url: post.image.url }] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">Article Not Found</h1>
        <p className="mt-4 text-gray-400">This article may have been removed or the URL is incorrect.</p>
      </div>
    );
  }

  const rawLatest = await getPosts();
  const post = mapWordPressPost(rawPost);
  const latest = mapWordPressPosts(rawLatest || []);

  const imageUrl = post.image?.url;

  // === STRONGER CLEANING: Remove featured image from body ===
  let articleContent = rawPost.content?.rendered || "<p>No content available.</p>";

  if (imageUrl) {
    // Remove image that matches the featured image URL
    const escapedUrl = imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    articleContent = articleContent
      .replace(new RegExp(`<img[^>]*src=["']${escapedUrl}["'][^>]*>`, 'gi'), '')
      .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')           // Remove figure blocks
      .replace(/<img[^>]*>/gi, (match) => {                       // Remove first image if still present
        return articleContent.indexOf(match) < 300 ? '' : match;
      });
  }

  return (
    <article className="article-page py-8">
      <div className="container max-w-[480px] md:max-w-[800px] mx-auto px-4">

        {/* HEADER */}
        <header className="article-header mb-8">
          <span className="article-category uppercase tracking-widest text-red-500 text-sm font-medium">
            Arsenal
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mt-3">
            {post.title}
          </h1>
          <ArticleMeta date={post.date} />
        </header>

        {/* FEATURED IMAGE - ONLY ONCE */}
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

        {/* ARTICLE LAYOUT */}
        <div className="article-layout flex flex-col lg:flex-row gap-10">

          <main className="article-main flex-1 min-w-0">
            <div className="article-body prose prose-base md:prose-lg max-w-none">
              {parse(articleContent)}
            </div>

            <ShareBar slug={post.slug} title={post.title} />

            <AuthorBox />
          </main>

          <aside className="article-sidebar w-full lg:w-80 hidden lg:block">
            {/* Sidebar content if needed */}
          </aside>
        </div>

        <RelatedPosts
          posts={latest
            .filter((item) => item.id !== post.id)
            .slice(0, 4)}
        />
      </div>
    </article>
  );
}