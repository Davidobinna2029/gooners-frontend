// lib/football/services/teams.ts

import { getTeam } from "../index";

export async function fetchTeam(
  id: number
) {
  return getTeam(id);
}