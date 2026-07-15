// lib/match/selectors.ts

import type { Match } from "./types";

export function isLiveMatch(match: Match): boolean {
  return match.status === "LIVE" || match.status === "HT";
}

export function isFinishedMatch(match: Match): boolean {
  return (
    match.status === "FT" ||
    match.status === "AET" ||
    match.status === "PEN"
  );
}

export function isUpcomingMatch(match: Match): boolean {
  return match.status === "NS";
}

export function getFeaturedMatch(matches: Match[]): Match | null {
  if (!matches.length) return null;

  const live = matches.find(isLiveMatch);
  if (live) return live;

  const upcoming = matches.find(isUpcomingMatch);
  if (upcoming) return upcoming;

  const finished = matches.find(isFinishedMatch);
  if (finished) return finished;

  return matches[0];
}

export function getLiveMatches(matches: Match[]): Match[] {
  return matches.filter(isLiveMatch);
}

export function getUpcomingMatches(matches: Match[]): Match[] {
  return matches.filter(isUpcomingMatch);
}

export function getFinishedMatches(matches: Match[]): Match[] {
  return matches.filter(isFinishedMatch);
}