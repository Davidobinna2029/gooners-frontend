"use client";

import {
  useEffect,
  useState,
} from "react";

import NewsCard from "./NewsCard";

export default function LatestNews() {
  const [posts, setPosts] =
    useState<any[]>([]);

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchPosts(page);
  }, []);

  async function fetchPosts(
    currentPage: number
  ) {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/posts?page=${currentPage}`
      );

      const data =
        await res.json();

      setPosts((prev) => [
        ...prev,
        ...data,
      ]);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight +
          window.scrollY >=
          document.body.offsetHeight -
            1200 &&
        !loading
      ) {
        const next =
          page + 1;

        setPage(next);

        fetchPosts(next);
      }
    }

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [page, loading]);

  return (
    <section className="section-block">
      <div className="section-title-row">
        <h2>
          Latest Arsenal News
        </h2>
      </div>

      <div className="news-grid">
        {posts.map((post) => (
          <NewsCard
            key={post.id}
            post={post}
          />
        ))}
      </div>

      {loading && (
        <div className="loading-text">
          Loading more news...
        </div>
      )}
    </section>
  );
}