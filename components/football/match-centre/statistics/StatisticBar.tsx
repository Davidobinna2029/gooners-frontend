import type {
  MatchStatistic,
} from "./statistics.types";

import {
  getBarWidth,
} from "./statistics.utils";

interface Props {

  statistic: MatchStatistic;

}

export default function StatisticBar({

  statistic,

}: Props) {

  const width =
    getBarWidth(statistic);

  return (

    <div className="space-y-2">

      <div className="flex items-center justify-between">

        <span className="font-semibold">
          {statistic.home}
          {statistic.unit ?? ""}
        </span>

        <span className="text-sm text-gray-500">
          {statistic.label}
        </span>

        <span className="font-semibold">
          {statistic.away}
          {statistic.unit ?? ""}
        </span>

      </div>

      <div className="flex h-2 overflow-hidden rounded-full bg-gray-200">

        <div
          className="bg-red-600"
          style={{
            width: `${width.home}%`,
          }}
        />

        <div
          className="bg-blue-600"
          style={{
            width: `${width.away}%`,
          }}
        />

      </div>

    </div>

  );

}