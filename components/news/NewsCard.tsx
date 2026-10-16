
import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

type NewsCardPost = CanonicalPost & {
  categoryName?: string | null;
  categoryNames?: string[];
};

export default function NewsCard({
  post,
}: {
  post: NewsCardPost;
}) {
  const rawImageUrl = post.image?.url;

  const imageUrl =
    typeof rawImageUrl === "string" &&
    rawImageUrl.trim().length > 0
      ? rawImageUrl.trim()
      : null;

  const actualCategory =
    post.categoryName?.trim() ||
    post.categoryNames?.find(
      (name) => typeof name === "string" && name.trim().length > 0,
    )?.trim();

  const cluster =
    typeof post.cluster === "string"
      ? post.cluster.trim()
      : "";

  const category =
    actualCategory ||
    (cluster && cluster.toLowerCase() !== "other"
      ? cluster.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) =>
          letter.toUpperCase(),
        )
      : "Arsenal News");

  const title =
    typeof post.title === "string" &&
    post.title.trim().length > 0
      ? post.title
      : "Arsenal News";

  return (
    <Link
      href={`/news/${post.slug}`}
      className="sky-news-card"
    >
      <div className="sky-news-image">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="120px"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-full w-full bg-gray-100"
          />
        )}
      </div>

      <div className="sky-news-content">
        <div className="sky-news-meta">
          <span className="sky-news-category">
            {category}
          </span>
        </div>

        <h3 className="sky-news-title">{title}</h3>

        <div className="sky-news-time">
          Latest Arsenal News
        </div>
      </div>
    </Link>
  );
}
