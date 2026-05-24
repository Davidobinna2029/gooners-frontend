import Standings from "@/components/sports/Standings";

/**
 * STANDINGS PAGE
 * Prevent static build + enable runtime rendering for live EPL data
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StandingsPage() {
  return (
    <main className="standings-page">
      <div className="container">
        <h1>
          Premier League
          Standings
        </h1>

        <Standings />
      </div>
    </main>
  );
}