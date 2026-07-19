"use client";

import type {

  PlayerRating,

} from "@/src/lib/football/analytics/playerRatingEngine";

interface Props {

  ratings: PlayerRating[];

}

export default function PlayerRatings({

  ratings,

}: Props) {

  if (!ratings.length)

    return null;

  return (

    <section

      className="

        rounded-xl

        border

        bg-white

        p-5

        shadow-sm

      "

    >

      <h3

        className="

          mb-5

          font-bold

        "

      >

        Player Ratings

      </h3>

      <div className="space-y-3">

        {ratings.map(

          (player) => (

            <div

              key={player.playerId}

              className="

                flex

                items-center

                justify-between

                rounded-lg

                border

                px-3

                py-2

              "

            >

              <span>

                {player.playerName}

              </span>

              <span

                className="

                  rounded-full

                  bg-emerald-500

                  px-3

                  py-1

                  text-sm

                  font-bold

                  text-white

                "

              >

                {player.rating.toFixed(1)}

              </span>

            </div>

          )

        )}

      </div>

    </section>

  );

}