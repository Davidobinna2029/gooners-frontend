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
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return {
      title: "Article Not Found | ArsenalTalks",
    };
  }

  const post = mapWordPressPost(rawPost);

  return {
    title: `${post.title} | ArsenalTalks`,
    description: post.excerpt?.slice(0, 150),
    openGraph: {
      title: post.title,
      description: post.excerpt?.slice(0, 150),
      images: post.image?.url ? [{ url: post.image.url }] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    return <div className="container py-20">Article Not Found</div>;
  }

  const rawLatest = await getPosts();
  const post = mapWordPressPost(rawPost);
  const latest = mapWordPressPosts(rawLatest || []);

  const featured = post.image?.url;

  let content = rawPost.content?.rendered || "";

  // ONLY remove duplicate featured image from WP content
  if (featured) {
    const escaped = featured.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    content = content.replace(
      new RegExp(
        `<figure[^>]*>.*?<img[^>]*src=["']${escaped}["'][^>]*>.*?<\/figure>`,
        "gi"
      ),
      ""
    );
  }

  return (
    <article className="article-page py-8">
      <div className="container max-w-[800px] mx-auto px-4">

        <header className="mb-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <ArticleMeta date={post.date} />
        </header>

        {/* ONLY ONE FEATURED IMAGE */}
        {featured && (
          <Image
            src={featured}
            alt={post.title}
            width={1200}
            height={675}
            priority
          />
        )}

        <div className="prose max-w-none">
          {parse(content)}
        </div>

        <ShareBar slug={post.slug} title={post.title} />
        <AuthorBox />

        <RelatedPosts
          posts={latest.filter((p) => p.id !== post.id).slice(0, 4)}
        />
      </div>
    </article>
  );
}