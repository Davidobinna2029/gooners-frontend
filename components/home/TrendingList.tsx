import Link from "next/link";

export default function TrendingList({
  posts,
}: any) {
  if (!posts?.length)
    return null;

  return (
    <section className="trending">
      <h2>Trending</h2>

      <ol>
        {posts.map(
          (post: any, index: number) => (
            <li key={post.id}>
              <span>
                {index + 1}
              </span>

              <Link
                href={`/news/${post.slug}`}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      post.title,
                  }}
                />
              </Link>
            </li>
          )
        )}
      </ol>
    </section>
  );
}