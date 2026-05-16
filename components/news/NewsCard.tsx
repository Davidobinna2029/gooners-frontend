import Link from "next/link";
import Image from "next/image";

export default function NewsCard({
  post,
}: any) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="news-card"
    >
      <div className="news-image">
        <Image
          src={
            post.featuredImage ||
            "/placeholder.jpg"
          }
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="news-content">
        <h3
          dangerouslySetInnerHTML={{
            __html: post.title,
          }}
        />
      </div>
    </Link>
  );
}