import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface DangerousAttacksResult {
  home: number;
  away: number;
}

function buildPossessions(
  events: FootballEvent[]
): Map<number | string, FootballEvent[]> {

  const possessions =
    new Map<number | string, FootballEvent[]>();

  for (const event of events) {

    if (
      event.possessionId === undefined ||
      event.possessionId === null
    ) {
      continue;
    }

    if (
      !possessions.has(event.possessionId)
    ) {
      possessions.set(
        event.possessionId,
        []
      );
    }

    possessions
      .get(event.possessionId)!
      .push(event);
  }

  return possessions;
}

function isDangerousPossession(
  possession: FootballEvent[]
): boolean {

  let score = 0;

  for (const event of possession) {

    if (event.progressive) {
      score += 2;
    }

    if (
      event.type === "key_pass"
    ) {
      score += 3;
    }

    if (
      event.type === "shot" ||
      event.type === "shot_on_target"
    ) {
      score += 3;
    }

    if (
      typeof event.xT === "number"
    ) {

      if (event.xT >= 0.20) {
        score += 2;
      }

      if (event.xT >= 0.40) {
        score += 2;
      }

    }

    if (
      typeof event.x === "number"
    ) {

      // Final third

      if (event.x >= 66) {
        score += 1;
      }

      // Penalty area

      if (event.x >= 88) {
        score += 2;
      }

    }

  }

  return score >= 5;
}

export function calculateDangerousAttacks(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): DangerousAttacksResult {

  const possessions =
    buildPossessions(events);

  let home = 0;
  let away = 0;

  possessions.forEach(
    (sequence) => {

      if (!sequence.length) {
        return;
      }

      if (
        !isDangerousPossession(sequence)
      ) {
        return;
      }

      const owner =
        sequence[0].teamId;

      if (owner === homeTeamId) {
        home++;
      }

      else if (
        owner === awayTeamId
      ) {
        away++;
      }

    }
  );

  return {
    home,
    away,
  };

}