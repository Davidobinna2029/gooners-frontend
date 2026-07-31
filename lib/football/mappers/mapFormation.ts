import type {
  MatchFormations,
  FormationShift,
} from "@/lib/football/intelligence/formationShiftEngine";

export interface FormationViewModel {

  home: FormationShift[];

  away: FormationShift[];

}

export function mapFormation(
  formations: MatchFormations
): FormationViewModel {

  return {

    home: formations.home,

    away: formations.away,

  };

}