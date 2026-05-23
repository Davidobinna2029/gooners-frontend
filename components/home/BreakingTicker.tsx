import Link from "next/link";
import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

interface Props {
  posts: NormalizedPost[];
}

export default function BreakingTicker({ posts }: Props) {
  if (!posts?.length) return null;

  // Editorial: show top 6 breaking posts
  const breaking = posts.slice(0, 6);

  return (
    <section className="breaking-ticker">
      <div className="container">
        <div className="ticker-inner">
          <span className="ticker-label">BREAKING</span>

          <div className="ticker-scroll">
            {breaking.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="ticker-item"
              >
                <span>{post.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}