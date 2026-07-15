"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import PostSearch from "./PostSearch";
import PostCard from "./PostCard";

import type { NewsPost } from "./types";

export default function PostPicker() {
  const [posts, setPosts] =
    useState<NewsPost[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadPosts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          "/api/posts",
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            `HTTP ${res.status}`
          );
        }

        const data =
          await res.json();

        setPosts(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load newsroom posts."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filtered =
    useMemo(() => {
      return [...posts]
        .filter((post) =>
          post.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )
        .sort(
          (a, b) =>
            new Date(
              b.date
            ).getTime() -
            new Date(
              a.date
            ).getTime()
        );
    }, [posts, search]);

  return (
    <div className="post-picker">
      <PostSearch
        value={search}
        onChange={setSearch}
      />

      {loading && (
        <div className="admin-card">
          Loading newsroom posts...
        </div>
      )}

      {!loading && error && (
        <div className="admin-card">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        filtered.length === 0 && (
          <div className="admin-card">
            No articles found.
          </div>
        )}

      {!loading &&
        !error &&
        filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
    </div>
  );
}