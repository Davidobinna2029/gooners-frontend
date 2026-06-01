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

  const mainImage = main.image?.url || "";
  const fallback = "/fallback.jpg";

  return (
    <section className="hero-magazine">
      <div className="container hero-grid">

        {/* MAIN STORY */}
        <div className="hero-main">
          <Link href={`/news/${main.slug}`}>

            <div className="hero-image">
              <Image
                src={mainImage || fallback}
                alt={main.title || "Arsenal news"}
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover"
              />
            </div>

            <div className="hero-overlay">
              <h1>{main.title}</h1>
              <p>{main.excerpt}</p>
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

              <div className="side-image">
                <Image
                  src={post.image?.url || fallback}
                  alt={post.title || "Arsenal article"}
                  fill
                  quality={80}
                  sizes="(max-width:768px) 100vw, 30vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>

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