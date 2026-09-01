import PlayerRatingCard from "./PlayerRatingCard";

interface PlayerRating {
  id: string;
  name: string;
  rating: number;
  position?: string;
  award?: string;
}

interface Props {
  players: PlayerRating[];
}

export default function PlayerRatingsSection({
  players,
}: Props) {
  return (
    <section className="space-y-5">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Player Ratings
          </h2>

          <p className="text-sm text-gray-500">
            Individual match performances
          </p>
        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {players.map((player) => (
          <PlayerRatingCard
            key={player.id}
            name={player.name}
            rating={player.rating}
            position={player.position}
            award={player.award}
          />
        ))}

      </div>

    </section>
  );
}