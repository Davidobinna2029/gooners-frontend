export default function VideoHighlights() {
  return (
    <section className="video-highlights">
      <div className="section-heading">
        <h2>Video Highlights</h2>
      </div>

      <div className="video-grid">
        <div className="video-card">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Highlights"
            allowFullScreen
          />
        </div>

        <div className="video-card">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Highlights"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}