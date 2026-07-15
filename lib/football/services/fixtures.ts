// lib/football/services/fixtures.ts

import {
  getFixtures,
  getResults,
} from "../index";

export async function fetchFixtures() {
  return getFixtures();
}

export async function fetchResults() {
  return getResults();
}