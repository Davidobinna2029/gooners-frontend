// lib/football/calculators/helpers.ts

import type { MatchData, NormalizedPlayerStats } from "@/lib/football/data/types";

export interface TeamPair {
  home: number;
  away: number;
}

/**
 * Sums a per-player stat across one team's players. Returns 0 if
 * MatchData.players is empty or undefined — e.g. before the
 * provider migration wiring populates it, or on a provider tier
 * without per-player stats. Every calculator below checks
 * hasPlayerData() before relying on this, rather than silently
 * returning zeros that look like "the team did nothing."
 */
export function sumTeamStat(
  data: MatchData,
  team: "home" | "away",
  selector: (player: NormalizedPlayerStats) => number
): number {

  return (data.players ?? [])
    .filter(player => player.team === team)
    .reduce((total, player) => total + selector(player), 0);

}

export function hasPlayerData(data: MatchData): boolean {
  return (data.players?.length ?? 0) > 0;
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}