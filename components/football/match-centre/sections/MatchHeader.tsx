import type { MatchFactsViewModel } from "@/lib/football/mappers/mapMatchFacts";

import {
  GlassCard,
  CardBody,
  Pill,
  TeamLogo,
} from "@/components/football/ui";

interface Props {
  facts: MatchFactsViewModel;
}

export default function MatchHeader({
  facts,
}: Props) {
  return (
    <GlassCard>
      <CardBody>
        <div className="flex flex-col items-center text-center">

          {/* Competition */}
          <Pill variant="primary">
            {facts.competition ?? "Competition"}
          </Pill>

          {/* Teams + Score */}
          <div className="mt-8 grid w-full grid-cols-3 items-center gap-6">

            {/* Home */}
            <div className="flex flex-col items-center">

              <TeamLogo
                teamName={facts.homeTeam.name}
                size="xl"
              />

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {facts.homeTeam.name}
              </h2>

              {facts.homeTeam.formation && (
                <p className="mt-1 text-sm text-gray-500">
                  {facts.homeTeam.formation}
                </p>
              )}

            </div>

            {/* Score */}
            <div className="flex flex-col items-center">

              <div className="text-6xl font-extrabold tracking-tight text-gray-900">
                {facts.score.home}

                <span className="mx-4 text-gray-300">
                  —
                </span>

                {facts.score.away}
              </div>

              <div className="mt-4">
                <Pill variant="primary">
                  Match Centre
                </Pill>
              </div>

            </div>

            {/* Away */}
            <div className="flex flex-col items-center">

              <TeamLogo
                teamName={facts.awayTeam.name}
                size="xl"
              />

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {facts.awayTeam.name}
              </h2>

              {facts.awayTeam.formation && (
                <p className="mt-1 text-sm text-gray-500">
                  {facts.awayTeam.formation}
                </p>
              )}

            </div>

          </div>

          {/* Match Details */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">

            {facts.venue && (
              <>
                <span>{facts.venue}</span>
                <span>•</span>
              </>
            )}

            {facts.kickoff && (
              <>
                <span>{facts.kickoff}</span>

                {facts.round && (
                  <>
                    <span>•</span>
                    <span>{facts.round}</span>
                  </>
                )}
              </>
            )}

          </div>

        </div>
      </CardBody>
    </GlassCard>
  );
}