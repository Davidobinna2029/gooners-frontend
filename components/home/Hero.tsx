import Link from "next/link";
import Image from "next/image";
import type { CanonicalPost } from "@/types";

interface Props {
  featured: CanonicalPost[];
}

export default function Hero({ featured }: Props) {
  if (!featured?.length) return null;

  const main = featured[0];
  const side = featured.slice(1, 4);

  return (
    <section className="sky-hero">
      <div className="container">

        <div className="sky-hero-grid">

          {/* MAIN HERO */}
          <Link
            href={`/news/${main.slug}`}
            className="sky-hero-main"
          >
            {main.image?.url && (
              <div className="sky-hero-image">
                <Image
                  src={main.image.url}
                  alt={main.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className="sky-hero-overlay">

              <div className="sky-hero-tag">
                BREAKING
              </div>

              <h1>{main.title}</h1>

              {main.excerpt && (
                <p>{main.excerpt}</p>
              )}

            </div>
          </Link>

          {/* SECONDARY STORIES */}
          <div className="sky-hero-side">

            {side.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="sky-side-card"
              >
                {post.image?.url && (
                  <div className="sky-side-image">
                    <Image
                      src={post.image.url}
                      alt={post.title}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="sky-side-content">

                  <span className="sky-side-category">
                    Arsenal
                  </span>

                  <h3>{post.title}</h3>

                </div>
              </Link>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}