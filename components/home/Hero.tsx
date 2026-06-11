import Link from "next/link";
import type { CanonicalPost } from "@/types";

interface Props {
  featured: CanonicalPost[];
}

export default function Hero({ featured }: Props) {
  if (!featured?.length) return null;

  const main = featured[0];
  const side = featured.slice(1, 4);

  if (!main?.image?.url) return null; // HARD GUARANTEE

  return (
    <section className="hero-magazine">
      <div className="container hero-grid">

        {/* MAIN */}
        <div className="hero-main">
          <Link href={`/news/${main.slug}`}>
            <div className="hero-image">
              <img
                src={main.image.url}
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
          {side
            .filter((p) => p.image?.url)
            .map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`}>
                <div className="side-image">
                  <img
                    src={post.image!.url}
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
            ))}
        </div>

      </div>
    </section>
  );
}