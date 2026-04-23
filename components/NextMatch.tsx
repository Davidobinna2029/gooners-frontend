import {
  getArsenalNextMatch,
} from "@/lib/football";

export default async function NextMatch() {
  const match =
    await getArsenalNextMatch();

  if (!match) {
    return (
      <div className="panel">
        <h2>Next Match</h2>
        <p>No fixture found.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Next Match</h2>

      <p>
        {match.teams.home.name} vs{" "}
        {match.teams.away.name}
      </p>

      <p className="muted">
        {new Date(
          match.fixture.date
        ).toLocaleString()}
      </p>

      <p className="muted">
        {match.league.name}
      </p>
    </div>
  );
}