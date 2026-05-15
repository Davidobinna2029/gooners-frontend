import Image from "next/image";

import {
  getPostBySlug,
} from "@/lib/wordpress";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function NewsArticlePage({
  params,
}: Props) {
  const { slug } =
    await params;

  const post =
    await getPostBySlug(
      slug
    );

  if (!post) {
    return (
      <main className="container page-space">
        <h1>
          Post not found
        </h1>
      </main>
    );
  }

  return (
    <article className="article-page">
      <div className="article-featured">
        <Image
          src={
            post.featuredImage
          }
          alt={
            post.title.rendered
          }
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <h1
        dangerouslySetInnerHTML={{
          __html:
            post.title.rendered,
        }}
      />

      <div
        dangerouslySetInnerHTML={{
          __html:
            post.content.rendered,
        }}
      />
    </article>
  );
}