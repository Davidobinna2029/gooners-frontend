import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

export default function NewsCard({ post }: { post: CanonicalPost }) {
  const imageUrl = post.image?.url;

  return (
    <Link href={`/news/${post.slug}`}>
      <div className="news-image">
        {imageUrl && (
          <Image src={imageUrl} alt={post.title} fill className="object-cover" />
        )}
      </div>

      <h3>{post.title}</h3>
    </Link>
  );
}