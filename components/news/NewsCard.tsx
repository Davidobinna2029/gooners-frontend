import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

export default function NewsCard({ post }: { post: CanonicalPost }) {
  const imageUrl =
    typeof post.image?.url === "string" && post.image.url.trim().length > 0
      ? post.image.url
      : null;

  return (
    <Link href={`/news/${post.slug}`} className="news-card block">

      {/* IMAGE WRAPPER (ALWAYS PRESENT FOR LAYOUT CONSISTENCY) */}
      <div className="news-image relative overflow-hidden aspect-video bg-gray-100">

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          />
        ) : (
          /* fallback state prevents layout collapse */
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            ArsenalTalks
          </div>
        )}

      </div>

      {/* TITLE BLOCK */}
      <h3 className="news-title line-clamp-2">
        {post.title}
      </h3>

    </Link>
  );
}