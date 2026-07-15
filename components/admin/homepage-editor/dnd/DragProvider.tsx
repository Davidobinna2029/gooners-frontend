"use client";

import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";

interface Props {
  children: React.ReactNode;
}

export default function DragProvider({
  children,
}: Props) {
  async function saveOverride(
    postId: number,
    type: string,
    value: number | string,
    reason: string
  ) {
    const response = await fetch(
      "/api/overrides",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          postId,

          type,

          value,

          createdBy:
            "Homepage Designer",

          reason,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to save override"
      );
    }
  }

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (!activeId.startsWith("story-")) {
      return;
    }

    const postId = Number(
      activeId.replace(
        "story-",
        ""
      )
    );

    try {
      /*
       * HERO
       */
      if (
        overId.startsWith("hero-")
      ) {
        const slot = Number(
          overId.replace(
            "hero-",
            ""
          )
        );

        await saveOverride(
          postId,
          "HERO_POSITION",
          slot,
          `Dragged into Hero ${slot}`
        );

        console.log(
          `Hero ${slot} updated`
        );

        return;
      }

      /*
       * BREAKING
       */
      if (
        overId === "breaking"
      ) {
        await saveOverride(
          postId,
          "FORCE_BREAKING",
          1,
          "Dragged into Breaking News"
        );

        console.log(
          "Breaking updated"
        );

        return;
      }

      /*
       * TRENDING
       */
      if (
        overId === "trending"
      ) {
        await saveOverride(
          postId,
          "BOOST_SCORE",
          100,
          "Dragged into Trending"
        );

        console.log(
          "Trending updated"
        );

        return;
      }

      /*
       * LATEST
       */
      if (
        overId === "latest"
      ) {
        await saveOverride(
          postId,
          "LATEST_POSITION",
          1,
          "Dragged into Latest News"
        );

        console.log(
          "Latest updated"
        );

        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <DndContext
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}