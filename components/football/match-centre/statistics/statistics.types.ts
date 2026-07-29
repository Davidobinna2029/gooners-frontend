export interface MatchStatistic {

  id: string;

  label: string;

  home: number | string;

  away: number | string;

  unit?: "%" | "";

  higherIsBetter?: boolean;

}