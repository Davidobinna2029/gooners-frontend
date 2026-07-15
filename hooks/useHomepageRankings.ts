"use client";

import { useCallback, useEffect, useState } from "react";
import { useNewsroomEvents } from "./useNewsroomEvents";

export interface HomepageStory {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
  author?: string;
  category?: string;
  date?: string;
}

export interface HomepageRankings {
  heroMain: HomepageStory | null;
  heroSide: HomepageStory[];
  breaking: HomepageStory[];
  trending: HomepageStory[];
  latest: HomepageStory[];
  all: HomepageStory[];

  stats: {
    hero: number;
    breaking: number;
    trending: number;
    latest: number;
    total: number;
  };

  generatedAt: string;
}

const EMPTY_DATA: HomepageRankings = {
  heroMain: null,
  heroSide: [],
  breaking: [],
  trending: [],
  latest: [],
  all: [],
  stats: {
    hero: 0,
    breaking: 0,
    trending: 0,
    latest: 0,
    total: 0,
  },
  generatedAt: "",
};

export function useHomepageRankings() {
  const [data, setData] =
    useState<HomepageRankings>(EMPTY_DATA);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadHomepage = useCallback(async () => {
    try {
      const res = await fetch(
        "/api/homepage-rankings",
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      setData(json);

      setError(null);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load homepage."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomepage();
  }, [loadHomepage]);

  useNewsroomEvents(() => {
    console.log(
      "📡 Homepage updated via Newsroom event"
    );

    loadHomepage();
  });

  return {
    data,
    loading,
    error,
    reload: loadHomepage,
  };
}