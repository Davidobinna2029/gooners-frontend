import LiveScores from "@/components/sports/LiveScores";

/**
 * LIVE DATA PAGE
 * Prevent static generation timeout
 */
export const dynamic = "force-dynamic";

export const revalidate = 0;

export default function LivePage() {
  return (
    <main className="live-page">
      <div className="container">
        <h1>Live Scores</h1>

        <LiveScores />
      </div>
    </main>
  );
}