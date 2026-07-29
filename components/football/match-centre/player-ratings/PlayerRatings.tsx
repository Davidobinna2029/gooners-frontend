import PlayerRatingRow from "./PlayerRatingRow";

import type {

  PlayerRating,

} from "./playerRating.types";

interface Props {

  home: PlayerRating[];

  away: PlayerRating[];

}

export default function PlayerRatings({

  home,

  away,

}: Props) {

  return (

    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-8 text-2xl font-bold">

        Player Ratings

      </h2>

      <div className="grid gap-10 lg:grid-cols-2">

        <div>

          <h3 className="mb-4 text-lg font-bold">

            Home Team

          </h3>

          <div className="space-y-3">

            {home.map(player => (

              <PlayerRatingRow
                key={player.id}
                player={player}
              />

            ))}

          </div>

        </div>

        <div>

          <h3 className="mb-4 text-lg font-bold">

            Away Team

          </h3>

          <div className="space-y-3">

            {away.map(player => (

              <PlayerRatingRow
                key={player.id}
                player={player}
              />

            ))}

          </div>

        </div>

      </div>

    </section>

  );

}