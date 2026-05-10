import Image from "next/image";

import {
  getPost,
} from "@/lib/wordpress";

interface Props {
  params: {
    slug: string;
  };
}

export default async function NewsPage({
  params,
}: Props) {
  const post = await getPost(
    params.slug
  );

  if (!post) {
    return (
      <div className="container page-space">
        Post not found.
      </div>
    );
  }

  return (
    <article className="article-page">
      <div className="article-hero-image">
        <Image
          src={
            post.featuredImage ||
            "/fallback.jpg"
          }
          alt={post.title.rendered}
          width={1400}
          height={800}
          className="hero-image"
          priority
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
          __html: post.content.rendered,
        }}
      />
    </article>
  );
}