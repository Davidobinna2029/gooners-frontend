import Link from "next/link";
import Image from "next/image";
import { WordPressPost } from "@/types/wordpress";

interface Props {
  posts: WordPressPost[];
}

export default function EditorsPicks({ posts }: Props) {
  if (!posts?.length) {
    return null;
  }

  const picks = posts.slice(2, 6);

  return (
    <section className="editors-picks">
      <div className="container">
        <div className="section-heading">
          <h2>Editor’s Picks</h2>
        </div>

        <div className="editors-grid">
          {picks.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="editors-card"
            >
              <div className="editors-image">
                <Image
                  src={post.featuredImage}
                  alt={post.title?.rendered || "Arsenal news"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="editors-content">
                <span className="editors-tag">{post.category}</span>

                <h3
                  dangerouslySetInnerHTML={{
                    __html: post.title?.rendered || "",
                  }}
                />

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