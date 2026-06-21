import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

export default function NewsCard({ post }: { post: CanonicalPost }) {
  const imageUrl =
    post.image?.url?.trim() ||
    "https://via.placeholder.com/800x450?text=ArsenalTalks";

  return (
    <Link href={`/news/${post.slug}`} className="news-card block">

      <div className="news-image relative overflow-hidden aspect-video bg-gray-100">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>

      <h3 className="news-title line-clamp-2">
        {post.title}
      </h3>

    </Link>
  );
}