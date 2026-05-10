import {
  getArsenalNextMatch,
} from "@/lib/football";

export default async function NextMatch() {
  const match: any =
    await getArsenalNextMatch();

  if (!match) {
    return (
      <p className="empty-text">
        No upcoming Arsenal match.
      </p>
    );
  }

  const home =
    match?.competitions?.[0]
      ?.competitors?.[0];

  const away =
    match?.competitions?.[0]
      ?.competitors?.[1];

  return (
    <div className="next-match-card">
      <h3>
        {
          home?.team
            ?.displayName
        }
      </h3>

      <span className="vs-text">
        VS
      </span>

      <h3>
        {
          away?.team
            ?.displayName
        }
      </h3>
    </div>
  );
}