export default function LiveScores({
  matches,
}: any) {
  if (!matches?.length)
    return null;

  return (
    <section className="live-scores">
      <h2>Live Scores</h2>

      <div className="scores-scroll">
        {matches.map((match: any) => (
          <div
            key={match.id}
            className="score-card"
          >
            <p>
              {
                match.competitions?.[0]
                  ?.competitors?.[0]
                  ?.team?.displayName
              }
            </p>

            <strong>
              {
                match.competitions?.[0]
                  ?.competitors?.[0]
                  ?.score
              }
              {" - "}
              {
                match.competitions?.[0]
                  ?.competitors?.[1]
                  ?.score
              }
            </strong>

            <p>
              {
                match.competitions?.[0]
                  ?.competitors?.[1]
                  ?.team?.displayName
              }
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}