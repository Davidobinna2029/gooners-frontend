import Link from "next/link";

import Image from "next/image";

interface Props {
  featured: any[];
}

export default function Hero({
  featured,
}: Props) {
  if (!featured?.length) {
    return null;
  }

  const mainPost = featured[0];

  const sidePosts =
    featured.slice(1, 4);

  return (
    <section className="hero-magazine">

      <div className="container">

        <div className="hero-grid">

          {/* MAIN STORY */}

          <Link
            href={`/news/${mainPost.slug}`}
            className="hero-main"
          >
            <Image
              src={
                mainPost.featuredImage
              }
              alt={mainPost.title}
              fill
              className="object-cover"
            />

            <div className="hero-overlay">

              <span className="hero-category">
                {mainPost.categories}
              </span>

              <h1>
                {mainPost.title}
              </h1>

              <p>
                {
                  mainPost.excerpt
                }
              </p>
            </div>
          </Link>

          {/* SIDE STORIES */}

          <div className="hero-side">

            {sidePosts.map(
              (post: any) => (
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
              )
            )}
          </div>

        </div>
      </div>
    </section>
  );
}