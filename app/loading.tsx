export default function Loading() {
  return (
    <main className="page-loading">
      <div className="container">
        <div className="loading-hero" />

        <div className="loading-grid">
          {Array.from({
            length: 6,
          }).map((_, i) => (
            <div
              key={i}
              className="loading-card"
            />
          ))}
        </div>
      </div>
    </main>
  );
}