import Link from "next/link";
import Image from "next/image";

import type { CanonicalPost } from "@/types/content";

interface Props {
  post: CanonicalPost;
}

export default function NewsCard({ post }: Props) {
  const imageUrl = post.image?.url || "/fallback.jpg";

  return (
    <Link
      href={`/news/${post.slug}`}
      className="news-card"
    >
      <div className="news-image">
        <Image
          src={imageUrl}
          alt={post.title || "Arsenal news"}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>

      <div className="news-content">
        <h3>{post.title}</h3>
      </div>
    </Link>
  );
}