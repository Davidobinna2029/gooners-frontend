export default function LiveScores({ matches = [] }: any) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return (
      <section className="live-scores">
        <h2>Live Scores</h2>
        <p>No live matches available right now.</p>
      </section>
    );
  }

  return (
    <section className="live-scores">
      <h2>Live Scores</h2>

      <div className="scores-scroll">
        {matches.map((match: any) => {
          const competition = match?.competitions?.[0];
          const competitors = competition?.competitors || [];

          const home = competitors?.[0];
          const away = competitors?.[1];

          const homeTeam = home?.team?.displayName || "Home";
          const awayTeam = away?.team?.displayName || "Away";

          const homeScore = home?.score ?? "0";
          const awayScore = away?.score ?? "0";

          const status =
            competition?.status?.type?.description ||
            competition?.status?.type?.state ||
            "Scheduled";

          const isLive =
            competition?.status?.type?.state === "in";

          const isFinal =
            competition?.status?.type?.completed === true;

          return (
            <div key={match?.id} className="score-card">

              {/* Status badge */}
              <div className="match-status">
                {isLive ? (
                  <span className="live-badge">LIVE</span>
                ) : isFinal ? (
                  <span className="final-badge">FT</span>
                ) : (
                  <span className="scheduled-badge">
                    {status}
                  </span>
                )}
              </div>

              {/* Teams */}
              <div className="teams">
                <p className="team-name">{homeTeam}</p>

                <strong className="score">
                  {homeScore} - {awayScore}
                </strong>

                <p className="team-name">{awayTeam}</p>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}