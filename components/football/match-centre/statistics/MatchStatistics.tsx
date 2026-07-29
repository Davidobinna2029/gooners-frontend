import StatisticBar from "./StatisticBar";

import type {

  MatchStatistic,

} from "./statistics.types";

interface Props {

  statistics: MatchStatistic[];

}

export default function MatchStatistics({

  statistics,

}: Props) {

  return (

    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">

        Match Statistics

      </h2>

      <div className="space-y-6">

        {statistics.length === 0 ? (

          <p className="text-gray-500">

            Statistics unavailable.

          </p>

        ) : (

          statistics.map(stat => (

            <StatisticBar

              key={stat.id}

              statistic={stat}

            />

          ))

        )}

      </div>

    </section>

  );

}