interface Props {
  name: string;

  rating: number;

  position?: string;

  award?: string;
}

export default function PlayerRatingCard({
  name,
  rating,
  position,
  award,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="font-bold text-gray-900">
            {name}
          </h3>

          {position && (
            <p className="text-sm text-gray-500">
              {position}
            </p>
          )}

        </div>

        <div className="text-right">

          <div className="text-2xl font-extrabold text-red-600">
            {rating.toFixed(1)}
          </div>

          {award && (
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-500">
              {award}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}