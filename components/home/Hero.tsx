import Link from "next/link";
import type { CanonicalPost } from "@/types";

interface Props {
  featured: CanonicalPost[];
}

const FALLBACK = "/fallback.jpg";

export default function Hero({ featured }: Props) {
  if (!Array.isArray(featured) || featured.length === 0) return null;

  const main = featured[0];
  const side = featured.slice(1, 4);

  // 🔍 DEBUG (check runtime data)
  console.log("MAIN IMAGE URL:", main.image?.url);

  const mainImage = main.image?.url || FALLBACK;

  return (
    <section className="hero-magazine">
      <div className="container hero-grid">

        {/* MAIN */}
        <div className="hero-main">
          <Link href={`/news/${main.slug}`}>
            <div className="hero-image">
              {/* 🚨 TEMP FIX: NO Next/Image (ISOLATION TEST) */}
              <img
                src={mainImage}
                alt={main.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
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
            const img = post.image?.url || FALLBACK;

            console.log("SIDE IMAGE URL:", post.image?.url);

            return (
              <Link key={post.id} href={`/news/${post.slug}`}>
                <div className="side-image">
                  {/* 🚨 TEMP FIX: NO Next/Image */}
                  <img
                    src={img}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
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