"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

export default function InfiniteNews() {
  const [posts, setPosts] =
    useState<any[]>([]);

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  async function loadPosts() {
    setLoading(true);

    const res = await fetch(
      `/api/posts?page=${page}`
    );

    const data =
      await res.json();

    setPosts((prev) => [
      ...prev,
      ...data,
    ]);

    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight +
          window.scrollY >=
        document.body.offsetHeight -
          500
      ) {
        setPage(
          (prev) => prev + 1
        );
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
  }, []);

  return (
    <div className="news-grid">
      {posts.map((post: any) => {
        const image =
          post?._embedded?.[
            "wp:featuredmedia"
          ]?.[0]
            ?.source_url ||
          post?.jetpack_featured_media_url ||
          "/fallback.jpg";

        return (
          <article
            key={post.id}
            className="news-card"
          >
            <Link
              href={`/news/${post.slug}`}
            >
              <div className="news-image">
                <img
                  src={image}
                  alt={
                    post.title
                      .rendered
                  }
                />
              </div>

              <div className="news-content">
                <h3>
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        post.title
                          .rendered,
                    }}
                  />
                </h3>
              </div>
            </Link>
          </article>
        );
      })}

      {loading && (
        <p className="loading-text">
          Loading more news...
        </p>
      )}
    </div>
  );
}