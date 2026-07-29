import type { MatchStatistic } from "./statistics.types";

export function getBarWidth(
  stat: MatchStatistic
) {

  const home =
    Number(stat.home);

  const away =
    Number(stat.away);

  if (
    Number.isNaN(home) ||
    Number.isNaN(away)
  ) {

    return {
      home: 50,
      away: 50,
    };

  }

  const total =
    home + away;

  if (total === 0) {

    return {
      home: 50,
      away: 50,
    };

  }

  return {

    home:
      (home / total) * 100,

    away:
      (away / total) * 100,

  };

}