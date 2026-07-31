"use client";

import { useMemo, useState } from "react";

import type {
  PlayerRatingsViewModel,
} from "@/lib/football/mappers/mapPlayerRatings";

import TopPerformerCard from "./TopPerformerCard";
import PlayerRankingRow from "./PlayerRankingRow";

type SortOption =
  | "rating"
  | "contribution"
  | "goals"
  | "assists";

interface Props {
  ratings: PlayerRatingsViewModel;
}

export default function PlayerRankingsCard({
  ratings,
}: Props) {
  const [sortBy, setSortBy] =
    useState<SortOption>("rating");


  const players = useMemo(() => {
    return [
      ratings.manOfTheMatch,
      ratings.bestAttacker,
      ratings.bestCreator,
      ratings.bestDefender,
      ratings.bestPasser,
      ratings.biggestThreat,
      ratings.surprisePerformer,
      ratings.underperformer,
    ].filter(
      (
        player
      ): player is NonNullable<typeof player> =>
        Boolean(player)
    );

  }, [ratings]);


  const sortedPlayers = useMemo(() => {

    return [...players].sort(
      (a, b) => {

        switch (sortBy) {

          case "goals":
            return (
              (b.goals ?? 0) -
              (a.goals ?? 0)
            );


          case "assists":
            return (
              (b.assists ?? 0) -
              (a.assists ?? 0)
            );


          case "contribution":
            return (
              (b.contributionScore ?? 0) -
              (a.contributionScore ?? 0)
            );


          case "rating":
          default:
            return (
              (b.rating ?? 0) -
              (a.rating ?? 0)
            );
        }

      }
    );

  }, [players, sortBy]);


  const topPlayer =
    sortedPlayers[0] ?? null;


  return (
    <div className="space-y-6">


      {topPlayer && (
        <TopPerformerCard
          player={topPlayer}
        />
      )}


      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">


        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between">


          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Player Rankings
            </h2>


            <p className="text-sm text-gray-500">
              AI-powered player performance rankings
            </p>

          </div>



          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as SortOption
              )
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >

            <option value="rating">
              Sort by Rating
            </option>

            <option value="contribution">
              Sort by Contribution
            </option>

            <option value="goals">
              Sort by Goals
            </option>

            <option value="assists">
              Sort by Assists
            </option>

          </select>


        </div>



        <div className="space-y-3 p-6">


          {sortedPlayers.length === 0 ? (

            <div className="py-8 text-center text-gray-500">
              No player ratings available.
            </div>

          ) : (

            sortedPlayers.map(
              (
                player,
                index
              ) => (

                <PlayerRankingRow
                  key={
                    `${player.playerName}-${index}`
                  }
                  player={player}
                  rank={index + 1}
                />

              )
            )

          )}


        </div>


      </div>


    </div>
  );
}