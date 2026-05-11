import Image from "next/image";

import {
  getPostBySlug,
} from "@/lib/wordpress";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({
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
      <div className="container page-space">
        <h1>Post not found</h1>
      </div>
    );
  }

  return (
    <article className="article-page">
      <Image
        src={
          post.featuredImage ||
          "/fallback.jpg"
        }
        alt={
          post.title.rendered
        }
        width={1200}
        height={700}
        className="article-featured-image"
        unoptimized
      />

      <h1>
        {post.title.rendered}
      </h1>

      <div
        dangerouslySetInnerHTML={{
          __html:
            post.content.rendered,
        }}
      />
    </article>
  );
}