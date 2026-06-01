export interface Match {
  home: string;
  away: string;
  score?: string;
  status?: "live" | "ft" | "upcoming";
  minute?: number;
}

export function mapMatch(data: any): Match {
  return {
    home: data.homeTeam?.name,
    away: data.awayTeam?.name,
    score: data.score,
    status: data.status,
    minute: data.minute,
  };
}