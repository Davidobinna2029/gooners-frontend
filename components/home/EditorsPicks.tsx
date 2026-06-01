import Link from "next/link";
import Image from "next/image";

import type { CanonicalPost } from "@/types";

interface Props {
  posts: CanonicalPost[];
}

export default function EditorsPicks({ posts }: Props) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  const featured = posts.slice(0, 4);

  return (
    <section className="editors-picks">
      <div className="container">

        <div className="section-header">
          <h2>Editor&apos;s Picks</h2>
        </div>

        <div className="editors-grid">
          {featured.map((post) => (
            <article key={post.id} className="editors-card">
              <Link href={`/news/${post.slug}`}>

                <div className="editors-image">
                  <Image
                    src={post.image?.url || "/fallback.jpg"}
                    alt={post.title || "News image"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="editors-content">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>

              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}