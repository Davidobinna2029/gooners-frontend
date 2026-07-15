// lib/football/repositories/dashboardRepository.ts

import {
  buildFootballDashboard,
} from "../orchestrator/footballDashboard";

import type {
  FootballDashboard,
} from "../models/footballDashboard";

export async function fetchFootballDashboard():
Promise<FootballDashboard> {
  return buildFootballDashboard();
}