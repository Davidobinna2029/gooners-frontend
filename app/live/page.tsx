import LiveScores from "@/components/sports/LiveScores";

export default function LivePage() {
  return (
    <main className="live-page">
      <div className="container">
        <h1>
          Live Scores
        </h1>

        <LiveScores />
      </div>
    </main>
  );
}