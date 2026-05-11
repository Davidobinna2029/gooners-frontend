"use client";

import Link from "next/link";
import Image from "next/image";

interface Props {
  post: any;
}

export default function NewsCard({
  post,
}: Props) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="news-card"
    >
      <div className="news-image">
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

      <div className="news-content">
        <h3
          dangerouslySetInnerHTML={{
            __html:
              post.title.rendered,
          }}
        />

        <p>
          {post.excerpt.rendered.slice(
            0,
            120
          )}
          ...
        </p>
      </div>
    </Link>
  );
}