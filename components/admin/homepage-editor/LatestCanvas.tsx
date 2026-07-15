"use client";

import Image from "next/image";

import DroppableSlot from "./dnd/DroppableSlot";
import { useHomepageRankings } from "@/hooks/useHomepageRankings";

function LatestCard({
  title,
  image,
  date,
}: {
  title: string;
  image?: string | null;
  date?: string;
}) {
  return (
    <div className="designer-latest-card">

      <div className="designer-latest-image">

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

      <div className="designer-latest-content">

        <h3>{title}</h3>

        {date && (
          <span className="designer-latest-date">
            {new Date(date).toLocaleDateString()}
          </span>
        )}

      </div>

    </div>
  );
}

export default function LatestCanvas() {
  const {
    data,
    loading,
  } = useHomepageRankings();

  if (loading) {
    return (
      <section className="designer-section">
        <h2>📰 Latest News</h2>

        <div className="designer-loading">
          Loading latest stories...
        </div>
      </section>
    );
  }

  return (
    <section className="designer-section">
      <h2>📰 Latest News</h2>

      <DroppableSlot id="latest">

        <div className="designer-latest-list">

          {data.latest.length === 0 && (
            <div className="designer-empty">
              No latest stories
            </div>
          )}

          {data.latest.map((story) => (
            <LatestCard
              key={story.id}
              title={story.title}
              image={story.image}
              date={story.date}
            />
          ))}

        </div>

      </DroppableSlot>
    </section>
  );
}