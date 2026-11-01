interface RelatedStoryGridProps {
  heading: string;
  posts: any[];
  variant?: "links" | "cards";
  getArticleUrl: (slug: string) => string;
  cleanText: (value: unknown) => string;
  normalizeImageUrl: (value: string) => string;
}

export default function RelatedStoryGrid({
  heading,
  posts,
  variant = "cards",
  getArticleUrl,
  cleanText,
  normalizeImageUrl,
}: RelatedStoryGridProps) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return null;
  }

  // READ MORE: text links only.
  if (variant === "links") {
    return (
      <nav
        className="my-6 border-l-4 border-[#d10000] pl-4"
        aria-label={heading}
      >
        <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-black">
          {heading}
        </h2>

        <ul className="space-y-2">
          {posts.map((related: any) => (
            <li key={related.id ?? related.slug}>
              <a
                href={getArticleUrl(related.slug)}
                className="font-semibold text-[#b00000] underline decoration-gray-300 underline-offset-4 hover:decoration-[#d10000]"
              >
                {cleanText(related.title) || "Arsenal story"}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // MORE ARSENAL STORIES: image cards.
  return (
    <section
      className="not-prose my-10 border-t-4 border-black pt-5"
      aria-label={heading}
    >
      <h2 className="mb-5 border-l-4 border-[#d10000] pl-3 text-xl font-extrabold uppercase tracking-wide text-black md:text-2xl">
        {heading}
      </h2>

      <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2">
        {posts.map((related: any) => {
          const imageCandidates = [
            related.relatedImageUrl,
            related.image?.url,
            related.image?.src,
            related.featuredImage?.url,
            related.featured_image_url,
            related.featured_media_url,
            related._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
          ];

          const imageValue = imageCandidates.find(
            (value) =>
              typeof value === "string" && value.trim().length > 0
          );

          const relatedImage = imageValue
            ? normalizeImageUrl(imageValue)
            : null;

          const title =
            cleanText(related.title) || "Arsenal story";

          return (
            <article
              key={related.id ?? related.slug}
              className="min-w-0"
            >
              <a
                href={getArticleUrl(related.slug)}
                className="group block text-inherit no-underline"
              >
                {/* Fixed-height image container */}
                <div
                  className="relative mb-3 w-full overflow-hidden bg-gray-100"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "202px",
                    minHeight: "202px",
                    position: "relative",
                    aspectRatio: "16 / 9",
                  }}
                >
                  {relatedImage ? (
                    <img
                      src={relatedImage}
                      alt={title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-semibold text-gray-500"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      ArsenalTalks
                    </div>
                  )}
                </div>

                <h3 className="text-left text-base font-bold leading-snug text-black transition-colors group-hover:text-[#b00000] md:text-lg">
                  {title}
                </h3>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}