import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface SequenceThreatResult {
  home: number;
  away: number;
}

const ATTACKING_EVENTS = [
  "pass",
  "successful_pass",
  "key_pass",
  "cross",
  "carry",
  "dribble",
  "take_on",
  "shot",
  "shot_on_target",
  "goal",
];

function buildPossessionMap(
  events: FootballEvent[]
): Map<number | string, FootballEvent[]> {
  const map = new Map<number | string, FootballEvent[]>();

  for (const event of events) {
    if (
      event.possessionId === undefined ||
      event.possessionId === null
    ) {
      continue;
    }

    if (!map.has(event.possessionId)) {
      map.set(event.possessionId, []);
    }

    map.get(event.possessionId)!.push(event);
  }

  return map;
}

function calculateThreat(
  possession: FootballEvent[]
): number {
  let threat = 0;

  for (const event of possession) {
    if (!ATTACKING_EVENTS.includes(event.type)) {
      continue;
    }

    // Base attacking contribution
    threat += 0.10;

    // Progressive action bonus
    if (event.progressive) {
      threat += 0.25;
    }

    // Expected Threat contribution
    if (typeof event.xT === "number") {
      threat += event.xT;
    }

    // Shot quality contribution
    if (typeof event.xG === "number") {
      threat += event.xG;
    }

    // Key pass bonus
    if (event.type === "key_pass") {
      threat += 0.50;
    }

    // Shot bonus
    if (
      event.type === "shot" ||
      event.type === "shot_on_target"
    ) {
      threat += 0.35;
    }

    // Goal bonus
    if (event.type === "goal") {
      threat += 1.00;
    }

    // Field position bonus
    if (typeof event.x === "number") {
      if (event.x >= 85) {
        threat += 0.20;
      } else if (event.x >= 66) {
        threat += 0.15;
      }
    }
  }

  return threat;
}

export function calculateSequenceThreat(
  events: FootballEvent[],
  homeTeamId: number,
  awayTeamId: number
): SequenceThreatResult {
  const possessions =
    buildPossessionMap(events);

  let home = 0;
  let away = 0;

  possessions.forEach((sequence) => {
    if (!sequence.length) {
      return;
    }

    const owner = sequence[0].teamId;

    if (owner === undefined) {
      return;
    }

    const value =
      calculateThreat(sequence);

    if (owner === homeTeamId) {
      home += value;
    } else if (owner === awayTeamId) {
      away += value;
    }
  });

  return {
    home: Number(home.toFixed(2)),
    away: Number(away.toFixed(2)),
  };
}