import Link from "next/link";

interface Props {
  posts: any[];
}

export default function BreakingTicker({
  posts,
}: Props) {
  if (!posts?.length)
    return null;

  return (
    <section className="breaking-ticker">
      <div className="ticker-label">
        BREAKING
      </div>

      <div className="ticker-scroll">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="ticker-item"
          >
            <span
              dangerouslySetInnerHTML={{
                __html:
                  post.title,
              }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}