// lib/football/providers/apiFootball/advanced/statisticsMapper.ts

import type {
  MatchStatistic,
} from "../../../advancedProvider";

export function mapApiFootballStatistics(
  response: any[]
): MatchStatistic[] {
  if (!response.length) {
    return [];
  }

  const home =
    response[0]?.statistics ?? [];

  const away =
    response[1]?.statistics ?? [];

  return home.map(
    (
      stat: any,
      index: number
    ): MatchStatistic => ({
      type: stat.type,

      home:
        stat.value ?? null,

      away:
        away[index]?.value ??
        null,
    })
  );
}