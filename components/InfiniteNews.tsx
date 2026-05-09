"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

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
                <Image
                  src={image}
                  alt={
                    post.title
                      .rendered
                  }
                  width={1200}
                  height={700}
                />
              </div>

              <h3>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      post.title
                        .rendered,
                  }}
                />
              </h3>
            </Link>
          </article>
        );
      })}

      {loading && (
        <p>Loading more news...</p>
      )}
    </div>
  );
}