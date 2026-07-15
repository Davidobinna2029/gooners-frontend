"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import type { NewsPost } from "@/components/admin/post-picker/types";

import DraggableStory from "./dnd/DraggableStory";

export default function StoryLibrary() {
  const [stories, setStories] = useState<NewsPost[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadStories() {
    try {
      setLoading(true);

      const res = await fetch("/api/posts", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load stories");
      }

      const data = await res.json();

      setStories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStories();
  }, []);

  const filteredStories = useMemo(() => {
    return stories.filter((story) =>
      story.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [stories, search]);

  return (
    <section className="designer-panel">
      <div className="designer-panel-header">
        <h2>Story Library</h2>

        <input
          className="designer-search"
          placeholder="Search Arsenal stories..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="designer-story-list">
        {loading && (
          <div className="designer-loading">
            Loading stories...
          </div>
        )}

        {!loading &&
          filteredStories.map((story) => (
            <DraggableStory
              key={story.id}
              story={story}
            >
              <div className="designer-story-card">
                <div className="designer-story-image">
                  {story.image ? (
                    <Image
                      src={story.image}
                      alt={story.title}
                      width={110}
                      height={75}
                      unoptimized
                    />
                  ) : (
                    <div className="designer-image-placeholder">
                      No Image
                    </div>
                  )}
                </div>

                <div className="designer-story-content">
                  <h3>{story.title}</h3>

                  <div className="designer-story-meta">
                    <span>{story.category}</span>

                    <span>{story.author}</span>
                  </div>

                  <div className="designer-story-date">
                    {new Date(
                      story.date
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </DraggableStory>
          ))}
      </div>
    </section>
  );
}