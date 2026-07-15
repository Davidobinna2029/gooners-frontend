// components/team/TeamHeader.tsx

import type { Team } from "@/lib/football/types/team";

interface Props {
  team: Team | null;
}

export default function TeamHeader({
  team,
}: Props) {
  if (!team) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-5">

        {team.crest && (
          <img
            src={team.crest}
            alt={team.name}
            className="h-20 w-20 object-contain"
          />
        )}

        <div>

          <h1 className="text-3xl font-bold">
            {team.name}
          </h1>

          {team.shortName && (
            <p className="text-gray-500">
              {team.shortName}
            </p>
          )}

        </div>

      </div>

    </section>
  );
}