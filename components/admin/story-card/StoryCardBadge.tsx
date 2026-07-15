"use client";

interface Props {
  heroSlot?: number | null;
  breaking?: boolean;
  trending?: boolean;
  status?: string;
}

export default function StoryCardBadge({
  heroSlot,
  breaking,
 trending,
  status,
}: Props) {
  return (
    <div className="story-card-badges">

      {heroSlot && (
        <span className="badge hero">
          Hero #{heroSlot}
        </span>
      )}

      {breaking && (
        <span className="badge breaking">
          Breaking
        </span>
      )}

      {trending && (
        <span className="badge trending">
          Trending
        </span>
      )}

      {status && (
        <span className="badge status">
          {status}
        </span>
      )}

    </div>
  );
}