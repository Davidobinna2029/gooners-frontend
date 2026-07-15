"use client";

import Image from "next/image";

import { useDraggable } from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

import type { HeroStory } from "./types";

interface Props {
  story: HeroStory;
}

export default function DraggableStory({
  story,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: story.id,
    data: story,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.45 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="hero-story-card"
      {...listeners}
      {...attributes}
    >
      <div className="hero-story-image">
        {story.image ? (
          <Image
            src={story.image}
            alt={story.title}
            width={90}
            height={70}
            unoptimized
          />
        ) : (
          <div className="hero-story-placeholder">
            No Image
          </div>
        )}
      </div>

      <div className="hero-story-content">
        <strong>{story.title}</strong>

        <small>
          #{story.id}
        </small>

        {story.category && (
          <div className="hero-story-category">
            {story.category}
          </div>
        )}
      </div>
    </div>
  );
}