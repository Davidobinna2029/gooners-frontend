import Link from "next/link";
import Image from "next/image";

interface Props {
  featured: any[];
}

export default function Hero({ featured }: Props) {
  if (!featured?.length) {
    return null;
  }

  const mainPost = featured[0];
  const sidePosts = featured.slice(1, 4);

  return (
    <section className="hero-magazine">
      <div className="container">
        <div className="hero-grid">
          {/* MAIN STORY */}
          <Link href={`/news/${mainPost.slug}`} className="hero-main">
            <Image
              src={mainPost.featuredImage}
              alt={mainPost.title?.rendered || "Arsenal news"}
              fill
              className="object-cover"
            />

            <div className="hero-overlay">
              <span className="hero-category">
                {mainPost.category}
              </span>

              <h1 dangerouslySetInnerHTML={{ __html: mainPost.title?.rendered }} />

              <p dangerouslySetInnerHTML={{ __html: mainPost.excerpt?.rendered }} />
            </div>
          </Link>

          {/* SIDE STORIES */}
          <div className="hero-side">
            {sidePosts.map((post: any) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="news-card">
                <div className="news-image">
                  <Image
                    src={post.featuredImage}
                    alt={post.title?.rendered || "Arsenal news"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="news-content">
                  <h3 dangerouslySetInnerHTML={{ __html: post.title?.rendered }} />
                  <p>{post.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}