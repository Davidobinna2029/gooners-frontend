"use client";

import SimulatorStory from "./SimulatorStory";

interface Props {
  title: string;
  icon?: string;
  posts: any[];
}

export default function SimulatorSection({
  title,
  icon,
  posts,
}: Props) {
  return (
    <section className="sim-section">

      <div className="sim-section-title">
        {icon && <span>{icon}</span>} {title}
      </div>

      {!posts?.length && (
        <div className="sim-empty">
          No stories available
        </div>
      )}

      {posts?.map((post) => (
        <SimulatorStory
          key={post.id}
          post={post}
          compact
        />
      ))}

    </section>
  );
}