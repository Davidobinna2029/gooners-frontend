// components/home/MatchCentreSection.tsx

import Link from "next/link";

import { fetchNextMatch } from "@/lib/football/services/match";

export default async function MatchCentreSection() {
  const match = await fetchNextMatch();

  if (!match) return null;

  const home =
    match.homeTeam?.name ?? "Arsenal";

  const away =
    match.awayTeam?.name ?? "Opponent";

  const homeScore =
    match.score?.home ?? 0;

  const awayScore =
    match.score?.away ?? 0;

  const competition =
    match.competition?.name ??
    "Premier League";

  const status =
    match.status ?? "SCHEDULED";

  const kickoff =
    match.kickoff ??
    new Date().toISOString();

  const isLive = [
    "LIVE",
    "IN_PLAY",
    "PAUSED",
  ].includes(status);

  const isFinished =
    status === "FINISHED";

  return (
    <section className="homepage-section">
      <div className="section-header">
        ⚽ Match Centre
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-gray-500">
          {competition}
        </p>

        <h2 className="mb-4 text-center text-2xl font-bold">
          {home}{" "}
          <span className="text-red-600">
            {homeScore} - {awayScore}
          </span>{" "}
          {away}
        </h2>

        <div className="mb-4 flex justify-center">
          {isLive ? (
            <span className="animate-pulse rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              🔴 LIVE
            </span>
          ) : isFinished ? (
            <span className="rounded-full bg-gray-700 px-3 py-1 text-xs font-semibold text-white">
              FULL TIME
            </span>
          ) : (
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              {new Date(kickoff).toLocaleString()}
            </span>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/fixtures"
            className="inline-flex rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Open Match Centre →
          </Link>
        </div>
      </div>
    </section>
  );
}