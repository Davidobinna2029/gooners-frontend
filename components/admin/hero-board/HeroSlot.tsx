"use client";

import Image from "next/image";

import { useDroppable } from "@dnd-kit/core";

import type { HeroStory } from "./types";

interface Props {
  slot: number;
  story?: HeroStory | null;
}

export default function HeroSlot({
  slot,
  story,
}: Props) {
  const { isOver, setNodeRef } =
    useDroppable({
      id: `hero-slot-${slot}`,
    });

  return (
    <div
      ref={setNodeRef}
      className={`hero-slot ${
        isOver ? "hero-slot-active" : ""
      }`}
    >
      <div className="hero-slot-header">
        Hero #{slot}
      </div>

      {!story && (
        <div className="hero-slot-empty">
          Drop story here
        </div>
      )}

      {story && (
        <div className="hero-slot-card">
          <div className="hero-slot-image">
            {story.image ? (
              <Image
                src={story.image}
                alt={story.title}
                width={120}
                height={80}
                unoptimized
              />
            ) : (
              <div className="hero-story-placeholder">
                No Image
              </div>
            )}
          </div>

          <div className="hero-slot-content">
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
      )}
    </div>
  );
}