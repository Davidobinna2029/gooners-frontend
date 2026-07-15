// lib/football/services/match.ts

import { getNextMatch, getMatch } from "../index";
import { footballCache } from "../cache";

export async function fetchNextMatch() {
  return footballCache(
    "next-match",
    () => getNextMatch()
  );
}

export async function fetchMatch(
  id: number
) {
  return footballCache(
    `match-${id}`,
    () => getMatch(id)
  );
}