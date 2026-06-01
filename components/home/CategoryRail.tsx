import Link from "next/link";
import Image from "next/image";

import type { CanonicalPost } from "@/types";

interface Props {
  title: string;
  posts: CanonicalPost[];
}

export default function CategoryRail({ title, posts }: Props) {
  if (!posts?.length) return null;

  return (
    <section className="category-rail">
      <div className="container">

        <h2>{title}</h2>

        <div className="rail-grid">
          {posts.map((post) => (
            <article key={post.id} className="rail-card">
              <Link href={`/news/${post.slug}`}>

                <div className="rail-image">
                  <Image
                    src={post.image.url || "/fallback.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3>{post.title}</h3>

              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}