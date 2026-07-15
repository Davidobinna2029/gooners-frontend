"use client";

import { useEffect, useState } from "react";

import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";

import HeroBoardSidebar from "./HeroBoardSidebar";
import HeroSlot from "./HeroSlot";

import type { HeroStory } from "./types";

type HeroMap = {
  [slot: number]: HeroStory | null;
};

export default function HeroBoard() {
  const [heroSlots, setHeroSlots] =
    useState<HeroMap>({
      1: null,
      2: null,
      3: null,
      4: null,
    });

  const [loading, setLoading] =
    useState(true);

  async function loadHero() {
    try {
      const res = await fetch(
        "/api/homepage-rankings",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      const next: HeroMap = {
        1: null,
        2: null,
        3: null,
        4: null,
      };

      if (Array.isArray(data.hero)) {
        data.hero.forEach((item: any) => {
          if (
            item.slot >= 1 &&
            item.slot <= 4
          ) {
            next[item.slot] = {
              id: item.postId,
              title:
                item.title ??
                `Post #${item.postId}`,
              image:
                item.image ?? null,
              category:
                item.category ??
                "",
            };
          }
        });
      }

      setHeroSlots(next);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHero();
  }, []);

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event;

    if (!over) return;

    const story =
      active.data.current as HeroStory;

    const slotId = String(over.id);

    if (
      !slotId.startsWith("hero-slot-")
    ) {
      return;
    }

    const slot = Number(
      slotId.replace(
        "hero-slot-",
        ""
      )
    );

    setHeroSlots((prev) => ({
      ...prev,
      [slot]: story,
    }));

    try {
      await fetch("/api/overrides", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          postId: story.id,
          type: "HERO_POSITION",
          value: slot,
          createdBy: "admin",
          reason: `Hero slot ${slot}`,
        }),
      });

      await loadHero();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="admin-card">
        Loading Hero Board...
      </div>
    );
  }

  return (
    <div className="admin-card">
      <h2>Hero Board</h2>

      <DndContext
        onDragEnd={handleDragEnd}
      >
        <div className="hero-board-layout">
          <HeroBoardSidebar />

          <div className="hero-slots">
            <HeroSlot
              slot={1}
              story={heroSlots[1]}
            />

            <HeroSlot
              slot={2}
              story={heroSlots[2]}
            />

            <HeroSlot
              slot={3}
              story={heroSlots[3]}
            />

            <HeroSlot
              slot={4}
              story={heroSlots[4]}
            />
          </div>
        </div>
      </DndContext>
    </div>
  );
}