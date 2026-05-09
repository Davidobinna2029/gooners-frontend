import {
  getArsenalNextMatch,
} from "@/lib/football";

export default async function NextMatch() {
  const match: any =
    await getArsenalNextMatch();

  if (!match) {
    return (
      <div className="panel">
        <h2>Next Match</h2>

        <p className="muted">
          No upcoming match
          available.
        </p>
      </div>
    );
  }

  const teams =
    match.competitions?.[0]
      ?.competitors;

  return (
    <div className="panel">
      <h2>Next Match</h2>

      <p>
        {
          teams?.[0]?.team
            ?.displayName
        }{" "}
        vs{" "}
        {
          teams?.[1]?.team
            ?.displayName
        }
      </p>

      <p className="muted">
        {new Date(
          match.date
        ).toLocaleString()}
      </p>
    </div>
  );
}