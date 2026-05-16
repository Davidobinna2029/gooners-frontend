import Header from "@/components/layout/Header";

export default function SearchPage() {
  return (
    <>
      <Header />

      <main className="search-page">
        <div className="search-container">
          <h1>Search ArsenalTalks</h1>

          <input
            type="text"
            placeholder="Search news..."
            className="search-input"
          />
        </div>
      </main>
    </>
  );
}