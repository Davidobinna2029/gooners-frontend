import {
  getLiveScores,
} from "@/lib/football";

export default async function LiveScores() {
  const games = await getLiveScores();

  return (
    <div className="panel">
      <h2>Live Scores</h2>

      <div className="score-list">
        {games.length === 0 && (
          <p className="muted">
            No live matches now.
          </p>
        )}

        {games.slice(0, 8).map(
          (game: any) => (
            <div
              key={game.fixture.id}
              className="score-card"
            >
              <span>
                {game.teams.home.name}
              </span>

              <strong>
                {game.goals.home} -{" "}
                {game.goals.away}
              </strong>

              <span>
                {game.teams.away.name}
              </span>

              <small>
                {
                  game.fixture.status
                    .elapsed
                }
                '
              </small>
            </div>
          )
        )}
      </div>
    </div>
  );
}