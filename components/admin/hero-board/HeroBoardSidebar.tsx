"use client";

import { useEffect, useMemo, useState } from "react";

import DraggableStory from "./DraggableStory";

import type { HeroStory } from "./types";

export default function HeroBoardSidebar() {
  const [stories, setStories] = useState<HeroStory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch("/api/posts", {
          cache: "no-store",
        });

        const data = await res.json();

        setStories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return stories;

    return stories.filter((story) =>
      story.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [stories, search]);

  return (
    <div className="hero-board-sidebar">
      <h3>Available Stories</h3>

      <input
        type="text"
        placeholder="Search stories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="hero-search"
      />

      {loading && (
        <p>Loading stories...</p>
      )}

      {!loading && filtered.length === 0 && (
        <p>No stories found.</p>
      )}

      <div className="hero-story-list">
        {filtered.map((story) => (
          <DraggableStory
            key={story.id}
            story={story}
          />
        ))}
      </div>
    </div>
  );
}