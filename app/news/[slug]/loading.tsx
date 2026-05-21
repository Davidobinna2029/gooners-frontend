export default function Loading() {
  return (
    <div className="article-loading">
      <div className="container">
        <div className="loading-title" />

        <div className="loading-image" />

        <div className="loading-lines">
          {Array.from({
            length: 12,
          }).map((_, i) => (
            <div
              key={i}
              className="loading-line"
            />
          ))}
        </div>
      </div>
    </div>
  );
}