"use client";

import Image from "next/image";

interface Props {
  image?: string | null;
  title: string;
  compact?: boolean;
}

export default function StoryCardImage({
  image,
  title,
  compact = false,
}: Props) {
  return (
    <div
      className={
        compact
          ? "story-card-image compact"
          : "story-card-image"
      }
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          style={{
            objectFit: "cover",
          }}
        />
      ) : (
        <div className="story-card-placeholder">
          No Image
        </div>
      )}
    </div>
  );
}