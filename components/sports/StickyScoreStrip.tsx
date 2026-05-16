interface Props {
  matches: any[];
}

export default function StickyScoreStrip({
  matches,
}: Props) {
  if (!matches?.length)
    return null;

  return (
    <section className="sticky-score-strip">
      <div className="score-strip-scroll">
        {matches.map((match: any) => {
          const home =
            match.competitions?.[0]
              ?.competitors?.[0];

          const away =
            match.competitions?.[0]
              ?.competitors?.[1];

          return (
            <div
              key={match.id}
              className="strip-card"
            >
              <span>
                {
                  home?.team
                    ?.shortDisplayName
                }
              </span>

              <strong>
                {home?.score}-
                {away?.score}
              </strong>

              <span>
                {
                  away?.team
                    ?.shortDisplayName
                }
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}interface Props {
  matches: any[];
}

export default function StickyScoreStrip({
  matches,
}: Props) {
  if (!matches?.length)
    return null;

  return (
    <section className="sticky-score-strip">
      <div className="score-strip-scroll">
        {matches.map((match: any) => {
          const home =
            match.competitions?.[0]
              ?.competitors?.[0];

          const away =
            match.competitions?.[0]
              ?.competitors?.[1];

          return (
            <div
              key={match.id}
              className="strip-card"
            >
              <span>
                {
                  home?.team
                    ?.shortDisplayName
                }
              </span>

              <strong>
                {home?.score}-
                {away?.score}
              </strong>

              <span>
                {
                  away?.team
                    ?.shortDisplayName
                }
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}