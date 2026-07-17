// src/design-system/football/FootballPlayerRow.tsx

import FootballCard from "./FootballCard";

interface FootballPlayerRowProps {
  number?: number;
  name: string;
  position?: string;
  captain?: boolean;
  starter?: boolean;
  substitute?: boolean;
}

export default function FootballPlayerRow({
  number,
  name,
  position,
  captain = false,
  starter = false,
  substitute = false,
}: FootballPlayerRowProps) {
  return (
    <FootballCard className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {number !== undefined && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700">
              #{number}
            </div>
          )}

          <div>
            <h4 className="font-semibold">
              {name}
            </h4>

            {position && (
              <p className="text-sm text-gray-500">
                {position}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {captain && (
            <span className="rounded-md bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-800">
              C
            </span>
          )}

          {starter && (
            <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
              XI
            </span>
          )}

          {substitute && (
            <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
              SUB
            </span>
          )}
        </div>
      </div>
    </FootballCard>
  );
}