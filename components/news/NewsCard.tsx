import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

export default function NewsCard({
  post,
}: {
  post: CanonicalPost;
}) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="news-card block"
    >
      {post.image?.url && (
        <div className="news-image relative overflow-hidden">
          <Image
            src={post.image.url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          />
        </div>
      )}

      <h3 className="news-title">
        {post.title}
      </h3>
    </Link>
  );
}