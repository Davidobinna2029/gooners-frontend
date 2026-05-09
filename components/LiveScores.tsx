import {
  getLiveScores,
} from "@/lib/football";

export default async function LiveScores() {
  const matches: any =
    await getLiveScores();

  return (
    <div className="panel">
      <h2>Live Scores</h2>

      {!matches?.length ? (
        <p className="muted">
          No live games.
        </p>
      ) : (
        matches
          ?.slice(0, 5)
          ?.map(
            (
              match: any,
              index: number
            ) => {
              const teams =
                match
                  ?.competitions?.[0]
                  ?.competitors;

              return (
                <div
                  key={index}
                  className="score-item"
                >
                  <p>
                    {
                      teams?.[0]
                        ?.team
                        ?.displayName
                    }{" "}
                    vs{" "}
                    {
                      teams?.[1]
                        ?.team
                        ?.displayName
                    }
                  </p>
                </div>
              );
            }
          )
      )}
    </div>
  );
}