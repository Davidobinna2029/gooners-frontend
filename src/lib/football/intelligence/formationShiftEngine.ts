import type { MatchIntelligence } from "./matchIntelligence";

/* ==========================================================
   TEAM
========================================================== */
export type FormationTeam =
  | "home"
  | "away";

/* ==========================================================
   FORMATION SHIFT TYPE
========================================================== */
export type FormationShiftType =
  | "attacking"
  | "defensive"
  | "balanced"
  | "unknown";

/* ==========================================================
   FORMATION SHIFT
========================================================== */
export interface FormationShift {
  minute: number;
  team: FormationTeam;
  fromFormation: string;
  toFormation: string;
  type: FormationShiftType;
  confidence: number;
  reason: string;
}

/* ==========================================================
   MATCH FORMATIONS
========================================================== */
export interface MatchFormations {
  home: FormationShift[];
  away: FormationShift[];
}

/* ==========================================================
   CONTEXT
========================================================== */
export interface FormationContext {
  intelligence: MatchIntelligence;
}

/* ==========================================================
   HELPERS
========================================================== */
function clampConfidence(
  value: number
): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Number(value.toFixed(2));
}

function createShift(
  minute: number,
  team: FormationTeam,
  fromFormation: string,
  toFormation: string,
  type: FormationShiftType,
  confidence: number,
  reason: string
): FormationShift {
  return {
    minute,
    team,
    fromFormation,
    toFormation,
    type,
    confidence: clampConfidence(confidence),
    reason,
  };
}

/* ==========================================================
   DETECTION RULES
========================================================== */
function detectAttackingShift(
  context: FormationContext,
  team: FormationTeam
): FormationShift | null {
  const metrics =
    team === "home"
      ? context.intelligence.home
      : context.intelligence.away;
  if (
    metrics.dominance.fieldTilt > 70 &&
    metrics.progression.penaltyAreaEntries > 20 &&
    metrics.dominance.tempoIndex > 65
  ) {
    return createShift(
      70,
      team,
      "4-3-3",
      "3-2-5",
      "attacking",
      0.90,
      "Sustained attacking pressure suggests a more aggressive attacking structure."
    );
  }
  return null;
}

/* ==========================================================
   DEFENSIVE SHIFT
========================================================== */
function detectDefensiveShift(
  context: FormationContext,
  team: FormationTeam
): FormationShift | null {
  const metrics =
    team === "home"
      ? context.intelligence.home
      : context.intelligence.away;
  if (
    metrics.defending.defensiveCompactness > 85 &&
    metrics.defending.defensiveLineHeight < 35
  ) {
    return createShift(
      75,
      team,
      "4-3-3",
      "5-4-1",
      "defensive",
      0.88,
      "Deep defensive line and compact shape indicate defensive reinforcement."
    );
  }
  return null;
}

/* ==========================================================
   COUNTER ATTACK SHAPE
========================================================== */
function detectCounterShape(
  context: FormationContext,
  team: FormationTeam
): FormationShift | null {
  const metrics =
    team === "home"
      ? context.intelligence.home
      : context.intelligence.away;
  const opponent =
    team === "home"
      ? context.intelligence.away
      : context.intelligence.home;
  if (
    metrics.dominance.dangerousAttacks > 15 &&
    metrics.dominance.possessionValue <
    opponent.dominance.possessionValue
  ) {
    return createShift(
      60,
      team,
      "4-2-3-1",
      "4-4-2",
      "balanced",
      0.84,
      "The team appeared to transition into a more counter-attacking structure."
    );
  }
  return null;
}

/* ==========================================================
   PROTECTING A LEAD
========================================================== */
function detectProtectLead(
  context: FormationContext,
  team: FormationTeam
): FormationShift | null {
  const metrics =
    team === "home"
      ? context.intelligence.home
      : context.intelligence.away;
  if (
    metrics.defending.defensiveCompactness > 88 &&
    metrics.dominance.tempoIndex < 45
  ) {
    return createShift(
      78,
      team,
      "4-3-3",
      "5-3-2",
      "defensive",
      0.91,
      "The team appeared to drop deeper to protect its advantage."
    );
  }
  return null;
}

/* ==========================================================
   CHASING THE GAME
========================================================== */
function detectChasingGame(
  context: FormationContext,
  team: FormationTeam
): FormationShift | null {
  const metrics =
    team === "home"
      ? context.intelligence.home
      : context.intelligence.away;
  if (
    metrics.progression.finalThirdEntries > 25 &&
    metrics.dominance.tempoIndex > 75
  ) {
    return createShift(
      72,
      team,
      "4-2-3-1",
      "3-2-5",
      "attacking",
      0.93,
      "The team increased attacking numbers while chasing the match."
    );
  }
  return null;
}

/* ==========================================================
   MIDFIELD OVERLOAD
========================================================== */
function detectMidfieldOverload(
  context: FormationContext,
  team: FormationTeam
): FormationShift | null {
  const metrics =
    team === "home"
      ? context.intelligence.home
      : context.intelligence.away;
  if (
    metrics.progression.progressivePasses > 40 &&
    metrics.progression.attackingWidth < 50
  ) {
    return createShift(
      55,
      team,
      "4-3-3",
      "4-1-4-1",
      "balanced",
      0.82,
      "The team concentrated play through central midfield."
    );
  }
  return null;
}

/* ==========================================================
   WIDE OVERLOAD
========================================================== */
function detectWideOverload(
  context: FormationContext,
  team: FormationTeam
): FormationShift | null {
  const metrics =
    team === "home"
      ? context.intelligence.home
      : context.intelligence.away;
  if (
    metrics.progression.attackingWidth > 80
  ) {
    return createShift(
      63,
      team,
      "4-3-3",
      "3-4-3",
      "attacking",
      0.84,
      "The team consistently attacked through wide overloads."
    );
  }
  return null;
}

/* ==========================================================
   HIGH PRESS SHAPE
========================================================== */
function detectHighPressShape(
  context: FormationContext,
  team: FormationTeam
): FormationShift | null {
  const metrics =
    team === "home"
      ? context.intelligence.home
      : context.intelligence.away;
  if (
    metrics.defending.PPDA < 7 &&
    metrics.defending.counterPressRecoveries > 12
  ) {
    return createShift(
      18,
      team,
      "4-3-3",
      "4-2-4",
      "attacking",
      0.89,
      "The pressing structure became noticeably more aggressive."
    );
  }
  return null;
}

/* ==========================================================
   EXECUTE DETECTORS
========================================================== */
function detectTeamShifts(
  context: FormationContext,
  team: FormationTeam
): FormationShift[] {
  const shifts: FormationShift[] = [];
  const detectors = [
    detectAttackingShift,
    detectDefensiveShift,
    detectCounterShape,
    detectProtectLead,
    detectChasingGame,
    detectMidfieldOverload,
    detectWideOverload,
    detectHighPressShape,
  ];
  for (const detector of detectors) {
    const result = detector(
      context,
      team
    );
    if (result) {
      shifts.push(result);
    }
  }
  return shifts.sort(
    (a, b) => a.minute - b.minute
  );
}

/* ==========================================================
   PUBLIC API
========================================================== */
export function buildFormationShifts(
  intelligence: MatchIntelligence
): MatchFormations {
  const context: FormationContext = {
    intelligence,
  };
  return {
    home: detectTeamShifts(
      context,
      "home"
    ),
    away: detectTeamShifts(
      context,
      "away"
    ),
  };
}