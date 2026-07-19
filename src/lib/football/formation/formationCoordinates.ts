// src/lib/football/formation/formationCoordinates.ts

export interface PitchCoordinate {
  x: number;
  y: number;
}

export type FormationCoordinates = PitchCoordinate[];

export const formationCoordinates: Record<
  string,
  FormationCoordinates
> = {

  /**
   * Coordinates are percentages.
   *
   * x = horizontal
   * y = vertical
   *
   * (0,0)
   * ┌──────────────┐
   * │              │
   * │              │
   * │              │
   * └──────────────┘
   *        (100,100)
   */

  "4-3-3": [

    // GK
    { x: 50, y: 94 },

    // Back four
    { x: 14, y: 75 },
    { x: 38, y: 77 },
    { x: 62, y: 77 },
    { x: 86, y: 75 },

    // Midfield
    { x: 24, y: 52 },
    { x: 50, y: 46 },
    { x: 76, y: 52 },

    // Front three
    { x: 18, y: 20 },
    { x: 50, y: 12 },
    { x: 82, y: 20 },

  ],

  "4-2-3-1": [

    { x: 50, y: 94 },

    { x: 14, y: 75 },
    { x: 38, y: 77 },
    { x: 62, y: 77 },
    { x: 86, y: 75 },

    { x: 38, y: 58 },
    { x: 62, y: 58 },

    { x: 18, y: 34 },
    { x: 50, y: 28 },
    { x: 82, y: 34 },

    { x: 50, y: 12 },

  ],

  "4-4-2": [

    { x: 50, y: 94 },

    { x: 14, y: 75 },
    { x: 38, y: 77 },
    { x: 62, y: 77 },
    { x: 86, y: 75 },

    { x: 16, y: 48 },
    { x: 38, y: 48 },
    { x: 62, y: 48 },
    { x: 84, y: 48 },

    { x: 36, y: 18 },
    { x: 64, y: 18 },

  ],

  "3-4-3": [

    { x: 50, y: 94 },

    { x: 24, y: 76 },
    { x: 50, y: 79 },
    { x: 76, y: 76 },

    { x: 10, y: 50 },
    { x: 38, y: 52 },
    { x: 62, y: 52 },
    { x: 90, y: 50 },

    { x: 18, y: 18 },
    { x: 50, y: 12 },
    { x: 82, y: 18 },

  ],

};