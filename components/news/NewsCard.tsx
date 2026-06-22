import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

export default function NewsCard({
  post,
}: {
  post: CanonicalPost;
}) {
  const imageUrl =
    post.image?.url?.trim() ||
    "https://via.placeholder.com/800x450?text=ArsenalTalks";

  const category =
    post.category ||
    "Arsenal News";

  return (
    <Link
      href={`/news/${post.slug}`}
      className="sky-news-card"
    >
      {/* IMAGE */}
      <div className="sky-news-image">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="120px"
        />
      </div>

      {/* CONTENT */}
      <div className="sky-news-content">

        <div className="sky-news-meta">
          <span className="sky-news-category">
            {category}
          </span>
        </div>

        <h3 className="sky-news-title">
          {post.title}
        </h3>

        <div className="sky-news-time">
          Latest Arsenal News
        </div>

      </div>
    </Link>
  );
}