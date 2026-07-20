export interface ControlIndexInput {
  possessionValue: number;
  sequenceThreat: number;
  dangerousAttacks: number;
  tempoIndex: number;
  fieldTilt: number;
  pressingIntensity: number;
}

export interface ControlIndexResult {
  home: number;
  away: number;
}

function normalize(
  home: number,
  away: number
): [number, number] {

  const total = home + away;

  if (total <= 0) {
    return [50, 50];
  }

  return [

    (home / total) * 100,

    (away / total) * 100,

  ];

}

export function calculateControlIndex(

  home: ControlIndexInput,

  away: ControlIndexInput

): ControlIndexResult {

  const homeScore =

    home.possessionValue * 0.25 +

    home.sequenceThreat * 0.25 +

    home.dangerousAttacks * 0.20 +

    home.tempoIndex * 0.15 +

    home.fieldTilt * 0.10 +

    home.pressingIntensity * 0.05;

  const awayScore =

    away.possessionValue * 0.25 +

    away.sequenceThreat * 0.25 +

    away.dangerousAttacks * 0.20 +

    away.tempoIndex * 0.15 +

    away.fieldTilt * 0.10 +

    away.pressingIntensity * 0.05;

  const [

    normalizedHome,

    normalizedAway,

  ] = normalize(

    homeScore,

    awayScore

  );

  return {

    home: Number(

      normalizedHome.toFixed(1)

    ),

    away: Number(

      normalizedAway.toFixed(1)

    ),

  };

}