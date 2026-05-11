import Image from "next/image";

import {
  getPost,
} from "@/lib/wordpress";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function NewsPage({
  params,
}: Props) {
  const { slug } =
    await params;

  const post =
    await getPost(slug);

  if (!post) {
    return (
      <div className="container page-space">
        <h1>
          Post not found
        </h1>
      </div>
    );
  }

  return (
    <article className="article-page">
      <Image
        src={
          post.featuredImage
        }
        alt={
          post.title.rendered
        }
        width={1400}
        height={800}
        unoptimized
        className="hero-image"
        priority
      />

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