"use client";

interface Props {
  slug: string;
  title: string;
}

export default function ShareBar({
  slug,
  title,
}: Props) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/news/${slug}`;

  return (
    <div className="share-bar">
      <a
        href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
        target="_blank"
      >
        X
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
      >
        FB
      </a>

      <a
        href={`https://wa.me/?text=${url}`}
        target="_blank"
      >
        WA
      </a>
    </div>
  );
}