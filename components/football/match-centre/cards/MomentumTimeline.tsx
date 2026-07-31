import type {
  MomentumWindow,
} from "@/lib/football/intelligence/momentumEngine";

interface Props {
  timeline: MomentumWindow[];
}

export default function MomentumTimeline({
  timeline,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <h3 className="mb-6 text-lg font-bold text-gray-900">
        Momentum Timeline
      </h3>

      <div className="space-y-5">

        {timeline.map((window) => {

          const color =
            window.dominantTeam === "home"
              ? "bg-red-600"
              : window.dominantTeam === "away"
              ? "bg-blue-600"
              : "bg-gray-400";

          const badge =
            window.dominantTeam === "home"
              ? "bg-red-100 text-red-700"
              : window.dominantTeam === "away"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700";

          return (

            <div
              key={`${window.minuteStart}-${window.minuteEnd}`}
              className="space-y-2"
            >

              <div className="flex items-center justify-between">

                <span className="text-sm font-semibold text-gray-600">
                  {window.minuteStart}'
                  {" - "}
                  {window.minuteEnd}'
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${badge}`}
                >
                  {window.dominantTeam.toUpperCase()}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                <div
                  className={`${color} h-full rounded-full transition-all duration-700`}
                  style={{
                    width: `${window.intensity}%`,
                  }}
                />

              </div>

              <p className="text-sm leading-6 text-gray-600">
                {window.reason}
              </p>

            </div>

          );

        })}

      </div>

    </div>
  );
}