// lib/football/intelligence/xgEngine.ts

export interface ShotEvent {
  minute: number;
  team: "home" | "away";

  x: number;
  y: number;

  onTarget: boolean;

  isGoal: boolean;

  bodyPart?: "left-foot" | "right-foot" | "header";

  situation?:
    | "open_play"
    | "corner"
    | "free_kick"
    | "penalty";
}

export interface XGSnapshot {
  minute: number;

  homeXG: number;

  awayXG: number;
}

export interface MatchXG {
  homeTotal: number;

  awayTotal: number;

  timeline: XGSnapshot[];

  difference: number;
}

function shotValue(
  shot: ShotEvent
): number {

  let value = 0.05;

  // Distance from goal
  const distance =
    Math.sqrt(
      Math.pow(100 - shot.x, 2) +
      Math.pow(50 - shot.y, 2)
    );

  if (distance < 8)
    value += 0.45;

  else if (distance < 15)
    value += 0.25;

  else if (distance < 22)
    value += 0.15;

  if (shot.onTarget)
    value += 0.10;

  if (shot.bodyPart === "header")
    value -= 0.05;

  if (shot.situation === "penalty")
    value = 0.76;

  return Math.min(value, 0.99);
}

export function calculateMatchXG(
  shots: ShotEvent[]
): MatchXG {

  let home = 0;
  let away = 0;

  const timeline: XGSnapshot[] = [];

  for (const shot of shots) {

    const xg = shotValue(shot);

    if (shot.team === "home")
      home += xg;

    else
      away += xg;

    timeline.push({
      minute: shot.minute,
      homeXG: Number(home.toFixed(2)),
      awayXG: Number(away.toFixed(2)),
    });

  }

  return {

    homeTotal: Number(home.toFixed(2)),

    awayTotal: Number(away.toFixed(2)),

    difference: Number((home - away).toFixed(2)),

    timeline,

  };

}