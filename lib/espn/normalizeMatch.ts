export function normalizeMatch(event: any) {
  const comp = event?.competitions?.[0];
  const teams = comp?.competitors || [];

  const home = teams?.[0];
  const away = teams?.[1];

  return {
    id: event?.id,

    status: comp?.status?.type?.state,

    home: {
      name: home?.team?.displayName || "Home",
      score: Number(home?.score || 0),
    },

    away: {
      name: away?.team?.displayName || "Away",
      score: Number(away?.score || 0),
    },
  };
}