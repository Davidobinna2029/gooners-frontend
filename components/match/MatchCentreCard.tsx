// components/match/MatchCentreCard.tsx

import type { Match } from "@/lib/football/types/match";

import MatchHeader from "./MatchHeader";
import MatchScore from "./MatchScore";
import MatchEvents from "./MatchEvents";
import MatchStatistics from "./MatchStatistics";
import MatchFooter from "./MatchFooter";

interface Props {
  match: Match;
}

export default function MatchCentreCard({
  match,
}: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-5">
        <MatchHeader match={match} />

        <MatchScore match={match} />

        {"events" in match && (
          <MatchEvents
            events={(match as any).events ?? []}
          />
        )}

        <MatchStatistics
          match={match}
        />

        <MatchFooter
          href={`/match/${match.id}`}
        />
      </div>
    </article>
  );
}