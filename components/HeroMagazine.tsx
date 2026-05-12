import Link from "next/link";

import Image from "next/image";

interface Props {
  posts: any[];
}

export default function HeroMagazine({
  posts,
}: Props) {
  if (!posts?.length)
    return null;

  const mainPost =
    posts[0];

  const sidePosts =
    posts.slice(1, 5);

  return (
    <section className="hero-magazine">
      <div className="container">
        <div className="hero-magazine-grid">
          <Link
            href={`/news/${mainPost.slug}`}
            className="hero-main-card"
          >
            <div className="hero-main-image relative">
              <Image
                src={
                  mainPost.featuredImage ||
                  "/fallback.jpg"
                }
                alt={
                  mainPost.title
                    .rendered
                }
                fill
                unoptimized
                className="object-cover"
                priority
              />
            </div>

            <div className="hero-main-overlay">
              <span>
                Breaking
              </span>

              <h1
                dangerouslySetInnerHTML={{
                  __html:
                    mainPost.title
                      .rendered,
                }}
              />
            </div>
          </Link>

          <div className="hero-side-grid">
            {sidePosts.map(
              (post: any) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="hero-side-card"
                >
                  <div className="hero-side-image relative">
                    <Image
                      src={
                        post.featuredImage ||
                        "/fallback.jpg"
                      }
                      alt={
                        post.title
                          .rendered
                      }
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="hero-side-content">
                    <h3
                      dangerouslySetInnerHTML={{
                        __html:
                          post.title
                            .rendered,
                      }}
                    />
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