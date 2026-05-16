import Link from "next/link";
import Image from "next/image";

export default function CategoryRail({
  title,
  posts,
}: any) {
  if (!posts?.length)
    return null;

  return (
    <section className="rail">
      <div className="rail-header">
        <h2>{title}</h2>
      </div>

      <div className="rail-scroll">
        {posts.map((post: any) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="rail-card"
          >
            <div className="rail-image">
              <Image
                src={
                  post.featuredImage ||
                  "/placeholder.jpg"
                }
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="rail-content">
              <h3
                dangerouslySetInnerHTML={{
                  __html:
                    post.title,
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}