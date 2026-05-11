import {
  getNextMatch,
} from "@/lib/football";

export default async function NextMatch() {
  const match: any =
    await getNextMatch();

  if (!match) {
    return (
      <div className="sidebar-card">
        <h3 className="sidebar-title">
          Next Match
        </h3>

        <p>No upcoming match.</p>
      </div>
    );
  }

  return (
    <div className="sidebar-card">
      <h3 className="sidebar-title">
        Next Match
      </h3>

      <div className="next-match-card">
        <p>
          {match.homeTeam}
        </p>

        <div className="vs-text">
          VS
        </div>

        <p>
          {match.awayTeam}
        </p>

        <br />

        <small>
          {new Date(
            match.date
          ).toLocaleString()}
        </small>
      </div>
    </div>
  );
}