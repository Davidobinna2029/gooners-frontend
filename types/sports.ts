export interface Team {
  id?: string;

  name?: string;

  shortDisplayName?: string;

  logo?: string;
}

export interface Competitor {
  team?: Team;

  score?: string;
}

export interface Competition {
  competitors?: Competitor[];

  status?: {
    type?: {
      description?: string;

      shortDetail?: string;
    };
  };
}

export interface Match {
  id?: string;

  name?: string;

  shortName?: string;

  date?: string;

  competitions?: Competition[];
}

export interface StandingTeam {
  displayName?: string;

  shortDisplayName?: string;

  logos?: {
    href?: string;
  }[];
}

export interface StandingStat {
  displayValue?: string;
}

export interface StandingRow {
  team?: StandingTeam;

  stats?: StandingStat[];
}