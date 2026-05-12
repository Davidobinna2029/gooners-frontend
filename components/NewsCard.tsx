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
      <div className="news-image relative">
        <Image
          src={
            post.featuredImage ||
            "/fallback.jpg"
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
              post.title
                .rendered,
          }}
        />

        <p
          dangerouslySetInnerHTML={{
            __html:
              post.excerpt?.rendered
                ?.replace(
                  /<[^>]+>/g,
                  ""
                )
                ?.slice(
                  0,
                  120
                ) + "...",
          }}
        />
      </div>
    </Link>
  );
}