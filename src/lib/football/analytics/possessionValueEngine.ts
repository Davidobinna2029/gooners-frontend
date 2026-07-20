import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface PossessionValueResult {
  home: number;
  away: number;
}

const POSSESSION_EVENTS = [
  "pass",
  "successful_pass",
  "key_pass",
  "cross",
  "carry",
  "dribble",
  "take_on",
];

function isPossessionAction(
  event: FootballEvent
): boolean {
  return POSSESSION_EVENTS.includes(event.type);
}

function calculatePossessionScore(
  possession: FootballEvent[]
): number {
  let score = 0;

  for (const event of possession) {
    if (!isPossessionAction(event)) {
      continue;
    }

    score += 0.15;

    if (event.progressive) {
      score += 0.40;
    }

    if (event.xT) {
      score += event.xT;
    }

    if (event.x !== undefined) {
      score += event.x / 100;
    }

    if (event.type === "key_pass") {
      score += 1.0;
    }
  }

  return score;
}

export function calculatePossessionValue(
  events: FootballEvent[],
  homeTeamId: number,
  awayTeamId: number
): PossessionValueResult {
  const possessions = new Map<number | string, FootballEvent[]>();

  for (const event of events) {
    if (!event.possessionId) {
      continue;
    }

    if (!possessions.has(event.possessionId)) {
      possessions.set(event.possessionId, []);
    }

    possessions.get(event.possessionId)!.push(event);
  }

  let home = 0;
  let away = 0;

  possessions.forEach((sequence) => {
    if (!sequence.length) {
      return;
    }

    const owner = sequence[0].teamId;

    const value = calculatePossessionScore(sequence);

    if (owner === homeTeamId) {
      home += value;
    }

    else if (owner === awayTeamId) {
      away += value;
    }
  });

  return {
    home: Number(home.toFixed(2)),
    away: Number(away.toFixed(2)),
  };
}