import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

export default function NewsCard({ post }: { post: CanonicalPost }) {
  const imageUrl =
    typeof post.image?.url === "string" && post.image.url.length > 0
      ? post.image.url
      : null;

  return (
    <Link href={`/news/${post.slug}`} className="news-card block">
      {imageUrl && (
        <div className="news-image relative overflow-hidden aspect-video">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          />
        </div>
      )}

      <h3 className="news-title">{post.title}</h3>
    </Link>
  );
}