import Link from "next/link";
import Image from "next/image";

import { NormalizedPost }
  from "@/lib/mappers/wordpressMapper";

interface Props {
  posts: NormalizedPost[];
}

export default function TransferCenter({
  posts,
}: Props) {
  if (!posts?.length) {
    return null;
  }

  // Optional editorial filter: only transfer-related posts
  const transfers = posts.filter((post) =>
    post.title.toLowerCase().includes("transfer")
  );

  return (
    <section className="transfer-center">
      <div className="container">

        <div className="section-header">
          <h2>Transfer Centre</h2>
        </div>

        <div className="transfer-grid">
          {transfers.map((post) => (
            <article
              key={post.id}
              className="transfer-card"
            >
              <Link
                href={`/news/${post.slug}`}
              >

                <div className="transfer-image">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
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