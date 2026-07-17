// src/lib/football/formation/formations.ts

import type { FormationDefinition } from "./types";

export const FORMATIONS: Record<
  string,
  FormationDefinition
> = {
  "4-3-3": {
    name: "4-3-3",
    rows: [4, 3, 3],
  },

  "4-2-3-1": {
    name: "4-2-3-1",
    rows: [4, 2, 3, 1],
  },

  "4-4-2": {
    name: "4-4-2",
    rows: [4, 4, 2],
  },

  "3-5-2": {
    name: "3-5-2",
    rows: [3, 5, 2],
  },

  "3-4-3": {
    name: "3-4-3",
    rows: [3, 4, 3],
  },

  "5-3-2": {
    name: "5-3-2",
    rows: [5, 3, 2],
  },

  "5-4-1": {
    name: "5-4-1",
    rows: [5, 4, 1],
  },

  "4-1-4-1": {
    name: "4-1-4-1",
    rows: [4, 1, 4, 1],
  },

  "4-5-1": {
    name: "4-5-1",
    rows: [4, 5, 1],
  },

  "3-4-2-1": {
    name: "3-4-2-1",
    rows: [3, 4, 2, 1],
  },

  "4-3-1-2": {
    name: "4-3-1-2",
    rows: [4, 3, 1, 2],
  },

  "4-1-2-1-2": {
    name: "4-1-2-1-2",
    rows: [4, 1, 2, 1, 2],
  },
};

export const DEFAULT_FORMATION =
  FORMATIONS["4-3-3"];