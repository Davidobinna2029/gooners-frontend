export interface MatchTeam {
  name: string;
}

export interface MatchFixture {
  date: string;
}

export interface MatchLeague {
  name: string;
}

export interface Match {
  league?: MatchLeague;
  teams?: {
    home?: MatchTeam;
    away?: MatchTeam;
  };
  fixture?: MatchFixture;
}