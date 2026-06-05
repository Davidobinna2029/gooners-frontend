import Image from "next/image";
import type { CanonicalPost } from "@/types/content";

export default function TrendingRail({
  posts,
}: {
  posts: CanonicalPost[];
}) {
  return (
    <div className="trending">
      {posts.map((post) => {
        const imageUrl = post.image?.url;

        return (
          <div key={post.id} className="trend-card">
            <div className="trend-image">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                />
              )}
            </div>

            <h4>{post.title}</h4>
          </div>
        );
      })}
    </div>
  );
}