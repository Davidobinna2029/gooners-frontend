
import type { Metadata } from "next";

import NewsCard from "@/components/news/NewsCard";
import { searchPosts } from "@/lib/api/search";
import { mapWordPressPosts } from "@/lib/mappers/wordpressMapper";
import type { CanonicalPost } from "@/types/content";

export const metadata: Metadata = {
  title: "Search ArsenalTalks | Arsenal News",
  description:
    "Search ArsenalTalks for Arsenal FC news, transfer updates, injury reports, match coverage and more.",
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const rawQuery = Array.isArray(params.q)
    ? params.q[0]
    : params.q;

  const query = (rawQuery ?? "").trim().slice(0, 120);

  let posts: CanonicalPost[] = [];
  let searchError = false;

  if (query.length >= 2) {
    try {
      const rawPosts = await searchPosts(query, 24);

      posts = mapWordPressPosts(
        Array.isArray(rawPosts) ? rawPosts : []
      );
    } catch (error) {
      console.error("[SEARCH PAGE] Search failed:", error);
      searchError = true;
    }
  }

  return (
    <main className="search-page">
      <div className="container">
        <header className="search-page-header">
          <p className="search-eyebrow">ArsenalTalks</p>

          <h1>Search ArsenalTalks</h1>

          <form
            action="/search"
            method="GET"
            className="search-page-form"
          >
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search Arsenal news..."
              aria-label="Search ArsenalTalks articles"
              maxLength={120}
            />

            <button type="submit">
              Search
            </button>
          </form>

          {query && (
            <p className="search-results-heading">
              Search results for: <strong>{query}</strong>
            </p>
          )}
        </header>

        {searchError ? (
          <div className="search-message">
            <p>
              Something went wrong while searching.
              Please try again.
            </p>
          </div>
        ) : query.length === 1 ? (
          <div className="search-message">
            <p>Please enter at least two characters.</p>
          </div>
        ) : query.length === 0 ? (
          <div className="search-message">
            <p>
              Enter a keyword to find ArsenalTalks articles.
            </p>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="news-grid">
              {posts.map((post) => (
                <NewsCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="search-message">
            <h2>No articles found</h2>
            <p>
              We couldn't find any articles matching
              "{query}". Try another search term.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
