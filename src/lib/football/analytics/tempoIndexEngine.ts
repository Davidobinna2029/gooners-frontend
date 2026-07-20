import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface TempoIndexResult {
  home: number;
  away: number;
}

const TEMPO_EVENTS = [
  "pass",
  "successful_pass",
  "carry",
  "dribble",
  "take_on",
];

function getEventTime(
  event: FootballEvent
): number {
  return (
    event.minute +
    (event.extraMinute ?? 0) / 100
  );
}

export function calculateTempoIndex(
  events: FootballEvent[],
  homeTeamId: number,
  awayTeamId: number
): TempoIndexResult {

  let homeActions = 0;
  let awayActions = 0;

  let homeProgressive = 0;
  let awayProgressive = 0;

  let homePossessionSeconds = 0;
  let awayPossessionSeconds = 0;

  for (const event of events) {

    if (
      !TEMPO_EVENTS.includes(event.type)
    ) {
      continue;
    }

    if (
      event.teamId === homeTeamId
    ) {

      homeActions++;

      if (event.progressive) {
        homeProgressive++;
      }

      if (
        event.possessionDuration
      ) {
        homePossessionSeconds +=
          event.possessionDuration;
      }

    }

    else if (
      event.teamId === awayTeamId
    ) {

      awayActions++;

      if (event.progressive) {
        awayProgressive++;
      }

      if (
        event.possessionDuration
      ) {
        awayPossessionSeconds +=
          event.possessionDuration;
      }

    }

  }

  const matchLength = Math.max(
    ...events.map(getEventTime),
    90
  );

  const calculateScore = (
    actions: number,
    progressive: number,
    possessionSeconds: number
  ) => {

    const actionsPerMinute =
      actions / matchLength;

    const progressiveRate =
      progressive / Math.max(actions, 1);

    const possessionSpeed =
      possessionSeconds > 0
        ? actions /
          (possessionSeconds / 60)
        : 0;

    const score =
      actionsPerMinute * 40 +
      progressiveRate * 40 +
      possessionSpeed * 20;

    return Number(
      score.toFixed(2)
    );

  };

  return {

    home: calculateScore(
      homeActions,
      homeProgressive,
      homePossessionSeconds
    ),

    away: calculateScore(
      awayActions,
      awayProgressive,
      awayPossessionSeconds
    ),

  };

}