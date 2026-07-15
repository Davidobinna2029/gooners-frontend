"use client";

import Image from "next/image";

import DroppableSlot from "./dnd/DroppableSlot";
import { useHomepageEditor } from "./context/HomepageEditorContext";

function HeroCard({
  title,
  image,
}: {
  title: string;
  image?: string | null;
}) {
  return (
    <div className="designer-hero-card">
      <div className="designer-hero-image">
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
          <div className="designer-image-placeholder">
            No Image
          </div>
        )}
      </div>

      <div className="designer-hero-content">
        <h3>{title}</h3>
      </div>
    </div>
  );
}

export default function HeroCanvas() {
  const { layout } = useHomepageEditor();

  return (
    <section className="designer-section">
      <h2>Hero</h2>

      <div className="hero-grid">
        <div className="hero-main">
          <DroppableSlot id="hero-1">
            {layout.hero[0] ? (
              <HeroCard
                title={layout.hero[0].title}
                image={layout.hero[0].image}
              />
            ) : (
              "Drop Story Here"
            )}
          </DroppableSlot>
        </div>

        {[1, 2, 3].map((index) => {
          const story = layout.hero[index];

          return (
            <DroppableSlot
              key={index}
              id={`hero-${index + 1}`}
            >
              {story ? (
                <HeroCard
                  title={story.title}
                  image={story.image}
                />
              ) : (
                `Hero #${index + 1}`
              )}
            </DroppableSlot>
          );
        })}
      </div>
    </section>
  );
}