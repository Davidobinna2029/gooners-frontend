import Image from "next/image";
import type { CanonicalPost } from "@/types/content";
import { getFeaturedImage } from "@/lib/utils/getFeaturedImage";

export default function CategoryRail({
  posts,
}: {
  posts: CanonicalPost[];
}) {
  return (
    <div className="rail">
      {posts.map((post) => {
        const imageUrl = getFeaturedImage(post as any);

        return (
          <div key={post.id} className="rail-card">
            <div className="rail-image">
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