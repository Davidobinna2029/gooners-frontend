"use client";

import Image from "next/image";

import DroppableSlot from "./dnd/DroppableSlot";
import { useHomepageRankings } from "@/hooks/useHomepageRankings";

function TrendingCard({
  title,
  image,
  index,
}: {
  title: string;
  image?: string | null;
  index: number;
}) {
  return (
    <div className="designer-trending-card">

      <div className="designer-trending-rank">
        #{index + 1}
      </div>

      <div className="designer-trending-image">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={80}
            height={60}
            unoptimized
          />
        ) : (
          <div className="designer-image-placeholder">
            No Image
          </div>
        )}
      </div>

      <div className="designer-trending-content">
        <h3>{title}</h3>
      </div>

    </div>
  );
}

export default function TrendingCanvas() {
  const {
    data,
    loading,
  } = useHomepageRankings();

  if (loading) {
    return (
      <section className="designer-section">
        <h2>📈 Trending</h2>

        <div className="designer-loading">
          Loading trending stories...
        </div>
      </section>
    );
  }

  return (
    <section className="designer-section">
      <h2>📈 Trending</h2>

      <DroppableSlot id="trending">

        <div className="designer-trending-list">

          {data.trending.length === 0 && (
            <div className="designer-empty">
              No trending stories
            </div>
          )}

          {data.trending.map(
            (story, index) => (
              <TrendingCard
                key={story.id}
                title={story.title}
                image={story.image}
                index={index}
              />
            )
          )}

        </div>

      </DroppableSlot>
    </section>
  );
}