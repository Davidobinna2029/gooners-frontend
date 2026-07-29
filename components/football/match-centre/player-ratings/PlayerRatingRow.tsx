import RatingBadge from "./RatingBadge";

import {

  ratingLabel,

} from "./playerRating.utils";

import type {

  PlayerRating,

} from "./playerRating.types";

interface Props {

  player: PlayerRating;

}

export default function PlayerRatingRow({

  player,

}: Props) {

  return (

    <div className="flex items-center justify-between rounded-xl border p-4">

      <div>

        <h4 className="font-semibold">

          {player.playerName}

        </h4>

        <p className="text-sm text-gray-500">

          {player.position ?? "Player"}

        </p>

      </div>

      <div className="flex items-center gap-3">

        <span className="text-sm text-gray-500">

          {ratingLabel(player.rating)}

        </span>

        <RatingBadge
          rating={player.rating}
        />

      </div>

    </div>

  );

}