import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

export default function NewsCard({ post }: { post: CanonicalPost }) {
  const imageUrl = post.image?.url;

  return (
    <Link href={`/news/${post.slug}`}>
      <div className="news-image relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title || "News image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="no-image" />
        )}
      </div>

      <h3>{post.title}</h3>
    </Link>
  );
}