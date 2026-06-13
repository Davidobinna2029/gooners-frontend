import Link from "next/link";
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
      <div className="container">

        {/* MAIN */}
        <div>
          <p>{main.image?.url}</p>

          <img
            src={main.image?.url}
            alt={main.title}
            width={1200}
            height={700}
          />

          <h1>{main.title}</h1>
        </div>

        {/* SIDE */}
        {side.map((post) => (
          <div key={post.id}>
            <img
              src={post.image?.url}
              alt={post.title}
              width={400}
              height={250}
            />

            <h3>{post.title}</h3>
          </div>
        ))}

      </div>
    </section>
  );
}