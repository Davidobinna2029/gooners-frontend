export function mapEspnMatches(events: any[]) {
  if (!Array.isArray(events)) return [];

  return events.map((event) => {
    const comp = event?.competitions?.[0];

    const home = comp?.competitors?.find(
      (c: any) => c.homeAway === "home"
    );

    const away = comp?.competitors?.find(
      (c: any) => c.homeAway === "away"
    );

    return {
      id: event.id,
      date: event.date,
      status: comp?.status?.type?.description || "Scheduled",

      league: event?.league?.name || "Premier League",

      teams: {
        home: {
          name: home?.team?.shortDisplayName,
          score: home?.score ?? 0,
        },
        away: {
          name: away?.team?.shortDisplayName,
          score: away?.score ?? 0,
        },
      },
    };
  });
}