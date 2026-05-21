import Link from "next/link";
import Image from "next/image";
import { WordPressPost } from "@/types/wordpress";

interface Props {
  posts: WordPressPost[];
}

export default function TransferCenter({ posts }: Props) {
  if (!posts?.length) {
    return null;
  }

  const transfers = posts.filter((post) =>
    post.category
      ?.toLowerCase()
      .includes("transfer")
  );

  return (
    <section className="transfer-center">
      <div className="container">
        <div className="section-heading">
          <h2>Transfer Center</h2>
        </div>

        <div className="transfer-grid">
          {transfers.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="transfer-card"
            >
              <div className="transfer-image">
                <Image
                  src={post.featuredImage}
                  alt={post.title.rendered}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="transfer-content">
                <span className="transfer-tag">
                  {post.category}
                </span>

                <h3>{post.title.rendered}</h3>

                <p>
                  {post.excerpt?.rendered
                    ?.replace(/<[^>]+>/g, "")
                    .slice(0, 110)}
                  ...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}