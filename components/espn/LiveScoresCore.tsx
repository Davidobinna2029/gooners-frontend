export default function LiveScoresCore({ match }: any) {
  if (!match) return null;

  return (
    <div className="live-core">

      <div className="match-header">
        <span>{match.home?.name}</span>

        <strong>
          {match.home?.score} - {match.away?.score}
        </strong>

        <span>{match.away?.name}</span>
      </div>

      <div className="status">
        {match.status === "in"
          ? "LIVE"
          : match.status === "post"
          ? "FT"
          : "PRE"}
      </div>

    </div>
  );
}