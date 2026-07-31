// lib/football/mappers/mapMatchStatistics.ts

import type {
  MatchIntelligence,
  PlayerInsight,
} from "@/lib/football/intelligence/matchIntelligence";

export interface MatchStatisticsViewModel {
  possession: {
    home: number;
    away: number;
  };

  shots: {
    home: number;
    away: number;
  };

  shotsOnTarget: {
    home: number;
    away: number;
  };

  xG: {
    home: number;
    away: number;
  };

  passAccuracy: {
    home: number;
    away: number;
  };

  progressivePasses: {
    home: number;
    away: number;
  };

  fieldTilt: {
    home: number;
    away: number;
  };

  dangerousAttacks: {
    home: number;
    away: number;
  };

  controlIndex: {
    home: number;
    away: number;
  };

  tempoIndex: {
    home: number;
    away: number;
  };

  PPDA: {
    home: number;
    away: number;
  };
}

function sumPlayers(
  players: PlayerInsight[],
  selector: (player: PlayerInsight) => number
): number {
  return players.reduce(
    (total, player) => total + selector(player),
    0
  );
}

function averagePassAccuracy(
  players: PlayerInsight[]
): number {
  const valid = players.filter(
    player => player.passesAttempted > 0
  );

  if (!valid.length) {
    return 0;
  }

  const total = valid.reduce(
    (sum, player) => sum + player.passAccuracy,
    0
  );

  return Number((total / valid.length).toFixed(1));
}

function estimateXG(
  shots: number,
  shotsOnTarget: number
): number {
  return Number(
    (shots * 0.08 + shotsOnTarget * 0.15).toFixed(2)
  );
}

export function mapMatchStatistics(
  intelligence: MatchIntelligence
): MatchStatisticsViewModel {
  const homeShots = sumPlayers(
    intelligence.home.players,
    player => player.shots
  );

  const awayShots = sumPlayers(
    intelligence.away.players,
    player => player.shots
  );

  const homeShotsOnTarget = sumPlayers(
    intelligence.home.players,
    player => player.shotsOnTarget
  );

  const awayShotsOnTarget = sumPlayers(
    intelligence.away.players,
    player => player.shotsOnTarget
  );

  return {
    possession: {
      home: intelligence.home.dominance.possessionValue,
      away: intelligence.away.dominance.possessionValue,
    },

    shots: {
      home: homeShots,
      away: awayShots,
    },

    shotsOnTarget: {
      home: homeShotsOnTarget,
      away: awayShotsOnTarget,
    },

    xG: {
      home: estimateXG(
        homeShots,
        homeShotsOnTarget
      ),
      away: estimateXG(
        awayShots,
        awayShotsOnTarget
      ),
    },

    passAccuracy: {
      home: averagePassAccuracy(
        intelligence.home.players
      ),
      away: averagePassAccuracy(
        intelligence.away.players
      ),
    },

    progressivePasses: {
      home:
        intelligence.home.progression.progressivePasses,
      away:
        intelligence.away.progression.progressivePasses,
    },

    fieldTilt: {
      home:
        intelligence.home.dominance.fieldTilt,
      away:
        intelligence.away.dominance.fieldTilt,
    },

    dangerousAttacks: {
      home:
        intelligence.home.dominance.dangerousAttacks,
      away:
        intelligence.away.dominance.dangerousAttacks,
    },

    controlIndex: {
      home:
        intelligence.home.dominance.controlIndex,
      away:
        intelligence.away.dominance.controlIndex,
    },

    tempoIndex: {
      home:
        intelligence.home.dominance.tempoIndex,
      away:
        intelligence.away.dominance.tempoIndex,
    },

    PPDA: {
      home:
        intelligence.home.defending.PPDA,
      away:
        intelligence.away.defending.PPDA,
    },
  };
}