interface Props {
  home: number;
  away: number;
}

export default function MomentumBar({
  home,
  away,
}: Props) {
  return (
    <div className="space-y-2">

      <div className="flex justify-between text-sm font-semibold">

        <span>{home}%</span>

        <span>Momentum</span>

        <span>{away}%</span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-200">

        <div
          className="h-full rounded-full bg-red-600 transition-all duration-500"
          style={{
            width: `${home}%`,
          }}
        />

      </div>

    </div>
  );
}