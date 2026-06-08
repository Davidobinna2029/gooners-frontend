import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types";

interface Props {
  featured: CanonicalPost[];
}

export default function Hero({ featured }: Props) {
  if (!Array.isArray(featured) || featured.length === 0) return null;

  const main = featured[0];
  const side = featured.slice(1, 4);

  const mainImage = main.image?.url;

  return (
    <section className="hero-magazine">
      <div className="container hero-grid">

        {/* MAIN */}
        <div className="hero-main">
          <Link href={`/news/${main.slug}`}>
            <div className="hero-image">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={main.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              )}
            </div>

            <div className="hero-overlay">
              <h1>{main.title}</h1>
              <p>{main.excerpt}</p>
            </div>
          </Link>
        </div>

        {/* SIDE */}
        <div className="hero-side">
          {side.map((post) => {
            const img = post.image?.url;

            return (
              <Link key={post.id} href={`/news/${post.slug}`}>
                <div className="side-image">
                  {img && (
                    <Image
                      src={img}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="30vw"
                    />
                  )}
                </div>

                <h3>{post.title}</h3>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}