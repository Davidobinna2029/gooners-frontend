"use client";

import Image from "next/image";

import DroppableSlot from "./dnd/DroppableSlot";
import { useHomepageRankings } from "@/hooks/useHomepageRankings";

function BreakingCard({
  title,
  image,
}: {
  title: string;
  image?: string | null;
}) {
  return (
    <div className="designer-breaking-card">
      <div className="designer-breaking-image">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={90}
            height={70}
            unoptimized
          />
        ) : (
          <div className="designer-image-placeholder">
            No Image
          </div>
        )}
      </div>

      <div className="designer-breaking-content">
        <h3>{title}</h3>
      </div>
    </div>
  );
}

export default function BreakingCanvas() {
  const { data, loading } =
    useHomepageRankings();

  if (loading) {
    return (
      <section className="designer-section">
        <h2>🚨 Breaking News</h2>

        <div className="designer-loading">
          Loading breaking stories...
        </div>
      </section>
    );
  }

  return (
    <section className="designer-section">
      <h2>🚨 Breaking News</h2>

      <DroppableSlot id="breaking">
        <div className="designer-breaking-list">

          {data.breaking.length === 0 && (
            <div className="designer-empty">
              No breaking stories
            </div>
          )}

          {data.breaking.map((story) => (
            <BreakingCard
              key={story.id}
              title={story.title}
              image={story.image}
            />
          ))}

        </div>
      </DroppableSlot>
    </section>
  );
}