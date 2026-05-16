"use client";

export default function ArticleError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="page-error">
      <h2>Failed to load article.</h2>

      <button onClick={reset}>
        Retry
      </button>
    </div>
  );
}