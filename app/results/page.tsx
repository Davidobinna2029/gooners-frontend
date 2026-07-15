import Results from "@/components/sports/Results";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ResultsPage() {
  return (
    <main className="results-page">
      <div className="container">

        <h1>
          Results
        </h1>

        <Results />

      </div>
    </main>
  );
}