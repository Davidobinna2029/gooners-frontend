import Link from "next/link";
import Image from "next/image";

import { NormalizedPost } from "@/lib/mappers/wordpressMapper";
import { getAdaptiveImage } from "@/lib/media/adaptiveImage";

interface Props {
  featured: NormalizedPost[];
}

export default function Hero({ featured }: Props) {
  if (!Array.isArray(featured) || featured.length === 0) return null;

  const main = featured[0];
  const side = featured.slice(1, 4);

  return (
    <section className="hero-magazine">
      <div className="container hero-grid">

        {/* MAIN STORY (LCP OPTIMIZED) */}
        <div className="hero-main">
          <Link href={`/news/${main.slug}`}>
            <div className="hero-image">
              <Image
                src={getAdaptiveImage(main, "hero")}
                alt={main.title || "Featured news image"}
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

        {/* SIDE STORIES (CARD OPTIMIZED) */}
        <div className="hero-side">
          {side.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="hero-side-item"
            >
              <div className="side-image">
                <Image
                  src={getAdaptiveImage(post, "card")}
                  alt={post.title || "News image"}
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 50vw, 30vw"
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