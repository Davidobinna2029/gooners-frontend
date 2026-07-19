// src/lib/football/matchClock.ts

/**
 * Calculates the elapsed match time in seconds from a kickoff date.
 *
 * Accepts:
 * - ISO date string
 * - Date object
 * - undefined/null
 *
 * Returns:
 * - 0 if kickoff is invalid or in the future
 * - elapsed seconds since kickoff otherwise
 */
export function getMatchElapsedSeconds(
  kickoff?: string | Date | null
): number {
  if (!kickoff) {
    return 0;
  }

  const kickoffDate =
    kickoff instanceof Date
      ? kickoff
      : new Date(kickoff);

  if (Number.isNaN(kickoffDate.getTime())) {
    return 0;
  }

  const now = Date.now();

  const elapsedMilliseconds =
    now - kickoffDate.getTime();

  if (elapsedMilliseconds <= 0) {
    return 0;
  }

  return Math.floor(
    elapsedMilliseconds / 1000
  );
}

/**
 * Returns the elapsed match time in whole minutes.
 */
export function getMatchElapsedMinutes(
  kickoff?: string | Date | null
): number {
  return Math.floor(
    getMatchElapsedSeconds(kickoff) / 60
  );
}

/**
 * Formats elapsed time as a football clock.
 *
 * Examples:
 * 5'
 * 45'
 * 90'
 */
export function formatMatchClock(
  kickoff?: string | Date | null
): string {
  const minutes =
    getMatchElapsedMinutes(kickoff);

  return `${minutes}'`;
}