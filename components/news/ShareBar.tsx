"use client";

interface Props {
  slug: string;
  title: string;
}

const SITE_URL = "https://arsenaltalks.com";

export default function ShareBar({
  slug,
  title,
}: Props) {
  const url = `${SITE_URL}/news/${slug}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="share-bar">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        FB
      </a>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          `${title} ${url}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WA
      </a>
    </div>
  );
}