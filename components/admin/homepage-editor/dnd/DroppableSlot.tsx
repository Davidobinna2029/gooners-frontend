"use client";

import { useDroppable } from "@dnd-kit/core";
import type { NewsPost } from "@/components/admin/post-picker/types";

interface Props {
  id: string;
  children?: React.ReactNode;

  story?: NewsPost | null;

  onStoryDropped?: (
    slot: string,
    story: NewsPost
  ) => void;
}

export default function DroppableSlot({
  id,
  children,
  story,
}: Props) {
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id,

    data: {
      slot: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`designer-dropzone ${
        isOver ? "active" : ""
      }`}
    >
      {story ? (
        <div className="designer-slot-story">
          <strong>{story.title}</strong>

          <small>
            {story.category}
          </small>
        </div>
      ) : (
        children
      )}
    </div>
  );
}