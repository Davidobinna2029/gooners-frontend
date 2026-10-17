export default function Loading() {
  return (
    <main
      className="category-page category-loading"
      aria-label="Loading category"
      aria-busy="true"
    >
      <div className="category-loading-title" />

      <div className="category-loading-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <article
            key={index}
            className="category-loading-card"
          >
            <div className="category-loading-image" />
            <div className="category-loading-line" />
            <div className="category-loading-line short" />
          </article>
        ))}
      </div>

      <p className="category-loading-message">
        Loading Arsenal news…
      </p>
    </main>
  );
}
