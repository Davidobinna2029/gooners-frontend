import type {
  MomentumPoint,
} from "./momentum.types";

export function normalizeMomentum(
  points: MomentumPoint[]
): MomentumPoint[] {

  if (points.length === 0) return [];

  const max = Math.max(
    ...points.map(p =>
      Math.max(
        p.home,
        p.away
      )
    )
  );

  if (max === 0)
    return points;

  return points.map(point => ({

    ...point,

    home:
      (point.home / max) * 100,

    away:
      (point.away / max) * 100,

  }));

}