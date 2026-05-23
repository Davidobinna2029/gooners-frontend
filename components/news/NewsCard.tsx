import Link from "next/link";
import Image from "next/image";

import { NormalizedPost }
  from "@/lib/mappers/wordpressMapper";

interface Props {
  post: NormalizedPost;
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
          src={post.image || "/placeholder.jpg"}
          alt={post.title || "Arsenal news"}
          fill
          className="object-cover"
        />
      </div>

      <div className="news-content">
        <h3>{post.title}</h3>
      </div>
    </Link>
  );
}