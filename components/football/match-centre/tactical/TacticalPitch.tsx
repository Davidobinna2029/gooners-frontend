interface Props {
  homeFormation?: string;
  awayFormation?: string;
}

export default function TacticalPitch({
  homeFormation,
  awayFormation,
}: Props) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-gradient-to-b from-green-700 to-green-800 p-8">

      <div className="flex h-[500px] items-center justify-center rounded-2xl border-2 border-white/20">

        <div className="text-center text-white">

          <h2 className="text-2xl font-bold">

            Tactical Board

          </h2>

          <p className="mt-4">

            {homeFormation ?? "Unknown"}

            {"  vs  "}

            {awayFormation ?? "Unknown"}

          </p>

        </div>

      </div>

    </div>
  );
}