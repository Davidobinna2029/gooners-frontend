import Image from "next/image";

import { notFound } from "next/navigation";

import Header from "@/components/layout/Header";

import { getPost } from "@/lib/wordpress";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props) {
  const { slug } =
    await params;

  const post =
    await getPost(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${post.title.rendered} | ArsenalTalks`,

    description:
      post.excerpt?.rendered
        ?.replace(
          /<[^>]+>/g,
          ""
        )
        ?.slice(0, 160),
  };
}

export default async function NewsPage({
  params,
}: Props) {
  const { slug } =
    await params;

  const post =
    await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="article-page">
        {/* FEATURED IMAGE */}
        <div className="article-image">
          <Image
            src={
              post.featuredImage ||
              "/fallback.jpg"
            }
            alt={
              post.title.rendered
            }
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>

        {/* META */}
        <div className="article-meta">
          <span>
            {post.categories}
          </span>

          <span>•</span>

          <span>
            {new Date(
              post.date
            ).toLocaleDateString()}
          </span>

          <span>•</span>

          <span>
            By {post.author}
          </span>
        </div>

        {/* TITLE */}
        <h1
          dangerouslySetInnerHTML={{
            __html:
              post.title.rendered,
          }}
        />

        {/* CONTENT */}
        <article
          className="article-content"
          dangerouslySetInnerHTML={{
            __html:
              post.content.rendered,
          }}
        />
      </main>
    </>
  );
}