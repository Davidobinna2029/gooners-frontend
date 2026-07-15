"use client";

import { useDraggable } from "@dnd-kit/core";
import type { NewsPost } from "@/components/admin/post-picker/types";

interface Props {
  story: NewsPost;
  children: React.ReactNode;
}

export default function DraggableStory({
  story,
  children,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `story-${story.id}`,
    data: {
      story,
    },
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,

    opacity: isDragging ? 0.55 : 1,

    cursor: "grab",

    transition: transform ? "none" : "150ms ease",

    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}