import {
  getLiveScores,
} from "@/lib/football";

export default async function LiveScores() {
  const games: any =
    await getLiveScores();

  return (
    <div className="score-list">
      {games.length === 0 && (
        <p className="empty-text">
          No live games currently.
        </p>
      )}

      {games
        .slice(0, 5)
        .map((match: any) => {
          const home =
            match?.competitions?.[0]
              ?.competitors?.[0];

          const away =
            match?.competitions?.[0]
              ?.competitors?.[1];

          return (
            <div
              key={match.id}
              className="score-card"
            >
              <div>
                <strong>
                  {
                    home?.team
                      ?.displayName
                  }
                </strong>

                <span>
                  {
                    home?.score
                  }
                </span>
              </div>

              <div>
                <strong>
                  {
                    away?.team
                      ?.displayName
                  }
                </strong>

                <span>
                  {
                    away?.score
                  }
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}