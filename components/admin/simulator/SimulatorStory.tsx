"use client";

import Image from "next/image";

interface SimulatorStoryProps {
  post: any;
  compact?: boolean;
}

export default function SimulatorStory({
  post,
  compact = false,
}: SimulatorStoryProps) {
  if (!post) return null;

  return (
    <article
      className={`sim-story-card ${
        compact ? "compact" : ""
      }`}
    >
      <div className="sim-story-image">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            unoptimized
          />
        ) : (
          <div className="sim-story-placeholder">
            No Image
          </div>
        )}
      </div>

      <div className="sim-story-content">
        <div className="sim-story-category">
          {post.category ?? "Arsenal"}
        </div>

        <h4 className="sim-story-title">
          {post.title}
        </h4>

        <div className="sim-story-meta">
          <span>
            #{post.id}
          </span>

          <span>
            {post.date
              ? new Date(
                  post.date
                ).toLocaleString()
              : ""}
          </span>
        </div>
      </div>
    </article>
  );
}