import LatestNews from "@/components/LatestNews";

export default function HomePage() {
  return (
    <main className="homepage">
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>
            ArsenalTalks
          </h1>

          <p>
            Latest Arsenal news,
            transfers, fixtures,
            and match updates.
          </p>
        </div>
      </section>

      <div className="homepage-content">
        <LatestNews />
      </div>
    </main>
  );
}