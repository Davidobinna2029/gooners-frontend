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
    <section className="hero-magazine">
      <div className="container hero-grid">

        {/* MAIN STORY */}
        <div className="hero-main">
          <Link href={`/news/${main.slug}`}>

            {main.image?.url && (
              <div className="hero-image">
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

            <div className="hero-overlay">
              <h1>{main.title}</h1>

              {main.excerpt && (
                <p>{main.excerpt}</p>
              )}
            </div>

          </Link>
        </div>

        {/* SIDE STORIES */}
        <div className="hero-side">
          {side.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="hero-side-item"
            >
              {post.image?.url && (
                <div className="side-image">
                  <Image
                    src={post.image.url}
                    alt={post.title}
                    fill
                    sizes="(max-width:768px) 100vw, 300px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="side-text">
                <h3>{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}