// lib/football/services/standings.ts

import { getStandings } from "../index";

export async function fetchStandings() {
  return getStandings();
}