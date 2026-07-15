// components/match/MatchStatistics.tsx

import type { Match } from "@/lib/football/types/match";
import type { MatchStatistic } from "@/lib/football/advancedProvider";

interface Props {
  match: Match;
  statistics?: MatchStatistic[];
}

export default function MatchStatistics({
  match,
  statistics = [],
}: Props) {
  if (!statistics.length) {
    return (
      <section className="match-statistics">
        <h3>Statistics</h3>

        <p>
          Statistics not available.
        </p>
      </section>
    );
  }

  return (
    <section className="match-statistics">
      <h3>Statistics</h3>

      <div className="statistics-list">
        {statistics.map((stat, index) => (
          <article
            key={`${stat.type}-${index}`}
            className="statistic-row"
          >
            <span>{stat.home}</span>

            <span>{stat.type}</span>

            <span>{stat.away}</span>
          </article>
        ))}
      </div>
    </section>
  );
}