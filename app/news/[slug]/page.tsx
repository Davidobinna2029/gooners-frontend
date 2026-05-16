import Image from "next/image";
import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";

import { getPost } from "@/lib/wordpress";

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * SEO METADATA
 */
export async function generateMetadata({
  params,
}: PageProps) {
  const post = await getPost(
    params.slug
  );

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const cleanExcerpt =
    post.excerpt
      ?.replace(/<[^>]+>/g, "")
      ?.slice(0, 160) || "";

  return {
    title: `${post.title} | ArsenalTalks`,

    description: cleanExcerpt,

    openGraph: {
      title: post.title,

      description: cleanExcerpt,

      images: [
        {
          url:
            post.featuredImage ||
            "/placeholder.jpg",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: post.title,

      description: cleanExcerpt,

      images: [
        post.featuredImage ||
          "/placeholder.jpg",
      ],
    },
  };
}

/**
 * PAGE
 */
export default async function NewsPage({
  params,
}: PageProps) {
  const post = await getPost(
    params.slug
  );

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="article-page">
        {/* HERO IMAGE */}
        {post.featuredImage && (
          <div className="article-image">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* META */}
        <div className="article-meta">
          <span>
            {post.author}
          </span>

          <span>•</span>

          <span>
            {new Date(
              post.date
            ).toLocaleDateString()}
          </span>
        </div>

        {/* TITLE */}
        <h1
          dangerouslySetInnerHTML={{
            __html: post.title,
          }}
        />

        {/* CONTENT */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />
      </main>
    </>
  );
}