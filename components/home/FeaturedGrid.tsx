import Link from "next/link";

import Image from "next/image";

interface Props {
  posts: any[];
}

export default function FeaturedGrid({
  posts,
}: Props) {
  if (!posts?.length) {
    return null;
  }

  return (
    <section>

      <div className="container">

        <h2>
          Latest Arsenal News
        </h2>

        <div className="news-grid">

          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="news-card"
            >
              <div className="news-image">

                <Image
                  src={
                    post.featuredImage
                  }
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="news-content">

                <h3>
                  {post.title}
                </h3>

                <p>
                  {
                    post.categories
                  }
                </p>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}