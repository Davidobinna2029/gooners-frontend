import Link from "next/link";
import Image from "next/image";

export default function Hero({
  post,
}: any) {
  if (!post) return null;

  return (
    <section className="hero">
      <Link
        href={`/news/${post.slug}`}
        className="hero-card"
      >
        <div className="hero-image">
          <Image
            src={
              post.featuredImage ||
              "/placeholder.jpg"
            }
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="hero-overlay">
          <span className="hero-tag">
            Breaking
          </span>

          <h1
            dangerouslySetInnerHTML={{
              __html: post.title,
            }}
          />
        </div>
      </Link>
    </section>
  );
}