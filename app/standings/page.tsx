import Standings from "@/components/sports/Standings";

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