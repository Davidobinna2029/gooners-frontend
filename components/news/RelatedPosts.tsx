
import Image from "next/image";
import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

interface RelatedPostsProps {
  posts: CanonicalPost[];
  heading?: string;
  showImages?: boolean;
}

export default function RelatedPosts({
  posts,
  heading = "Related Stories",
  showImages = false,
}: RelatedPostsProps) {
  const validPosts = posts.filter(
    (post) =>
      typeof post.slug === "string" &&
      post.slug.trim().length > 0 &&
      typeof post.title === "string" &&
      post.title.trim().length > 0
  );

  const relatedPosts = showImages
    ? validPosts
        .filter(
          (post) =>
            typeof post.image?.url === "string" &&
            post.image.url.trim().length > 0
        )
        .slice(0, 3)
    : validPosts.slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section
      className={showImages ? "my-9" : "my-7"}
      aria-label={heading}
    >
      <h2
        className={
          showImages
            ? "mb-5 text-xl font-extrabold tracking-tight text-gray-950 sm:text-2xl"
            : "mb-3 text-base font-bold text-gray-900"
        }
      >
        {heading}
      </h2>

      {showImages ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
          {relatedPosts.map((post) => {
            const imageUrl = post.image?.url?.trim();

            if (!imageUrl) return null;

            return (
              <article key={post.id} className="min-w-0">
                <Link
                  href={`/news/${post.slug}`}
                  className="group block"
                  aria-label={post.title}
                >
                  <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 900px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <h3 className="text-base font-bold leading-snug text-gray-950 transition-colors group-hover:text-[#d10000]">
                    {post.title}
                  </h3>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <ul className="m-0 list-none space-y-2 p-0">
          {relatedPosts.map((post) => (
            <li key={post.id} className="m-0 p-0">
              <Link
                href={`/news/${post.slug}`}
                className="text-base font-medium leading-relaxed text-[#d10000] hover:text-red-800 hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
