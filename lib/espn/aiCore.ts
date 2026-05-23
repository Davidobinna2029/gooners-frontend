export function computeAnalytics(match: any) {
  const diff = match.home.score - match.away.score;

  let homeWin = 50 + diff * 12;

  homeWin = Math.max(5, Math.min(95, homeWin));

  return {
    homeWin: Math.round(homeWin),
    awayWin: 100 - Math.round(homeWin),
  };
}