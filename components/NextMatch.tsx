import {
  getArsenalNextMatch,
} from "@/lib/football";

export default async function NextMatch() {
  const match =
    await getArsenalNextMatch();

  return (
    <div className="panel">
      <h2>Next Match</h2>

      {!match ? (
        <p className="muted">
          No upcoming match
          available.
        </p>
      ) : (
        <>
          <p>
            {
              match.homeTeam
                ?.name
            }{" "}
            vs{" "}
            {
              match.awayTeam
                ?.name
            }
          </p>

          <p className="muted">
            {new Date(
              match.utcDate
            ).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
}