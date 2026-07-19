export interface MatchInsight {

  id: string;

  text: string;

}

interface Inputs {

  homeXG: number;

  awayXG: number;

  homeMomentum: number;

  awayMomentum: number;

  homeTerritory: number;

  awayTerritory: number;

  homeWinProbability: number;

  awayWinProbability: number;

}

export function generateInsights(

  data: Inputs

): MatchInsight[] {

  const insights: MatchInsight[] = [];

  if (data.homeXG > data.awayXG + 1) {

    insights.push({

      id: "xg-home",

      text:
        "The home side has created significantly better chances.",

    });

  }

  if (data.awayXG > data.homeXG + 1) {

    insights.push({

      id: "xg-away",

      text:
        "The away side has created significantly better chances.",

    });

  }

  if (data.homeMomentum > 70) {

    insights.push({

      id: "momentum-home",

      text:
        "Momentum is heavily favouring the home team.",

    });

  }

  if (data.awayMomentum > 70) {

    insights.push({

      id: "momentum-away",

      text:
        "Momentum is heavily favouring the away team.",

    });

  }

  if (data.homeTerritory > 60) {

    insights.push({

      id: "territory-home",

      text:
        "The home side is controlling territory.",

    });

  }

  if (data.awayTerritory > 60) {

    insights.push({

      id: "territory-away",

      text:
        "The away side is controlling territory.",

    });

  }

  if (data.homeWinProbability > 70) {

    insights.push({

      id: "win-home",

      text:
        "The home side is currently the favourite to win.",

    });

  }

  if (data.awayWinProbability > 70) {

    insights.push({

      id: "win-away",

      text:
        "The away side is currently the favourite to win.",

    });

  }

  if (!insights.length) {

    insights.push({

      id: "balanced",

      text:
        "The match remains evenly balanced.",

    });

  }

  return insights;

}