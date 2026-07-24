// ==========================================================
// Match View Model Mapper
// ArsenalTalks
// ==========================================================

import type { MatchViewModel } from "@/lib/football/models/matchViewModel";

export function mapMatchToViewModel(raw: any): MatchViewModel {
  return {
    id: String(
      raw?.id ??
      raw?.match?.id ??
      ""
    ),

    competition:
      raw?.competition?.name ??
      raw?.competition ??
      "Unknown Competition",

    homeTeam:
      raw?.homeTeam?.name ??
      raw?.teams?.home?.name ??
      "Home",

    awayTeam:
      raw?.awayTeam?.name ??
      raw?.teams?.away?.name ??
      "Away",

    homeScore:
      Number(
        raw?.score?.fullTime?.home ??
        raw?.goals?.home ??
        raw?.homeScore ??
        0
      ),

    awayScore:
      Number(
        raw?.score?.fullTime?.away ??
        raw?.goals?.away ??
        raw?.awayScore ??
        0
      ),

    status:
      raw?.status ??
      "SCHEDULED",

    venue:
      raw?.venue ??
      raw?.stadium?.name ??
      "Unknown Venue",

    referee:
      raw?.referee ??
      undefined,

    attendance:
      raw?.attendance ??
      undefined,

    kickoff:
      raw?.utcDate ??
      raw?.kickoff ??
      new Date().toISOString(),

    matchday:
      raw?.matchday ??
      undefined,
  };
}