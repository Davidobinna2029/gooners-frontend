import {
  ratingColor,
} from "./playerRating.utils";

interface Props {

  rating: number;

}

export default function RatingBadge({

  rating,

}: Props) {

  return (

    <div
      className={`rounded-full px-3 py-1 text-sm font-bold ${ratingColor(
        rating
      )}`}
    >

      {rating.toFixed(1)}

    </div>

  );

}