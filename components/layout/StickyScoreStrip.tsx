interface Team {
  shortDisplayName?: string;
  name?: string;
}

interface Competitor {
  team?: Team;
  score?: number | string;
}

interface Competition {
  competitors?: Competitor[];
}

interface Match {
  id: string | number;
  competitions?: Competition[];
}

interface Props {
  matches: Match[];
}

/**
 * Safely extracts text from unknown API shapes
 */
function safeText(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    return value.shortDisplayName || value.name || value.rendered || "";
  }
  return "";
}

/**
 * StickyScoreStrip (hardened)
 */
export default function StickyScoreStrip({ matches }: Props) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return null;
  }

  return (
    <section className="sticky-score-strip">
      <div className="score-strip-scroll">
        {matches.map((match) => {
          const home = match.competitions?.[0]?.competitors?.[0];
          const away = match.competitions?.[0]?.competitors?.[1];

          const homeTeam = home?.team;
          const awayTeam = away?.team;

          return (
            <div key={match.id} className="strip-card">
              <span>{safeText(homeTeam)}</span>

              <strong>
                {home?.score ?? "-"} - {away?.score ?? "-"}
              </strong>

              <span>{safeText(awayTeam)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}