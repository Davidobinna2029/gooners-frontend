// src/design-system/football/FootballEventCard.tsx

import FootballCard from "./FootballCard";

interface FootballEventCardProps {
  minute: string;

  eventType: string;

  player: string;

  detail?: string;

  team?: string;

  icon?: React.ReactNode;
}

function getEventColor(type: string) {
  switch (type.toLowerCase()) {
    case "goal":
      return "bg-green-100 text-green-700";

    case "penalty":
      return "bg-green-100 text-green-700";

    case "yellow card":
      return "bg-yellow-100 text-yellow-700";

    case "red card":
      return "bg-red-100 text-red-700";

    case "substitution":
      return "bg-blue-100 text-blue-700";

    case "var":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getDefaultIcon(type: string) {
  switch (type.toLowerCase()) {
    case "goal":
      return "⚽";

    case "penalty":
      return "⚽";

    case "yellow card":
      return "🟨";

    case "red card":
      return "🟥";

    case "substitution":
      return "🔄";

    case "var":
      return "📺";

    default:
      return "•";
  }
}

export default function FootballEventCard({
  minute,
  eventType,
  player,
  detail,
  team,
  icon,
}: FootballEventCardProps) {
  return (
    <FootballCard className="p-4">
      <div className="flex items-start gap-4">

        {/* Minute */}

        <div className="min-w-[60px] text-center">
          <div className="rounded-lg bg-gray-100 px-3 py-2 font-bold">
            {minute}
          </div>
        </div>

        {/* Event */}

        <div className="flex-1">

          <div className="flex items-center gap-3">

            <span className="text-xl">
              {icon ?? getDefaultIcon(eventType)}
            </span>

            <div>

              <h4 className="font-semibold">
                {player}
              </h4>

              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEventColor(
                  eventType
                )}`}
              >
                {eventType}
              </span>

            </div>

          </div>

          {detail && (
            <p className="mt-2 text-sm text-gray-500">
              {detail}
            </p>
          )}

        </div>

        {/* Team */}

        {team && (
          <div className="text-right text-sm text-gray-500">
            {team}
          </div>
        )}

      </div>
    </FootballCard>
  );
}