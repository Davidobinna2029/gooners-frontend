import Link from "next/link";
import Image from "next/image";

import type { NormalizedPost } from "@/lib/mappers/wordpressMapper";

interface Props {
  posts: NormalizedPost[];
}

export default function TransferCenter({ posts }: Props) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  const transfers = posts.filter((post) =>
    (post.title ?? "").toLowerCase().includes("transfer")
  );

  if (transfers.length === 0) return null;

  return (
    <section className="transfer-center">
      <div className="container">

        <div className="section-header">
          <h2>Transfer Centre</h2>
        </div>

        <div className="transfer-grid">
          {transfers.map((post) => (
            <article key={post.id} className="transfer-card">
              <Link href={`/news/${post.slug}`}>

                <div className="transfer-image">
                  <Image
                    src={post.image || "/fallback.jpg"}
                    alt={post.title || "Transfer news"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="transfer-content">
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