"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export interface HomepageStory {
  id: number;
  title: string;
  image?: string | null;
  date?: string;
}

export interface HomepageLayoutState {
  hero: HomepageStory[];
  breaking: HomepageStory[];
  trending: HomepageStory[];
  latest: HomepageStory[];
}

interface HomepageEditorContextValue {
  layout: HomepageLayoutState;
  setLayout: React.Dispatch<
    React.SetStateAction<HomepageLayoutState>
  >;
}

const HomepageEditorContext =
  createContext<HomepageEditorContextValue | null>(
    null
  );

export function HomepageEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layout, setLayout] =
    useState<HomepageLayoutState>({
      hero: [],
      breaking: [],
      trending: [],
      latest: [],
    });

  const value = useMemo(
    () => ({
      layout,
      setLayout,
    }),
    [layout]
  );

  return (
    <HomepageEditorContext.Provider value={value}>
      {children}
    </HomepageEditorContext.Provider>
  );
}

export function useHomepageEditor() {
  const context = useContext(
    HomepageEditorContext
  );

  if (!context) {
    throw new Error(
      "useHomepageEditor must be used inside HomepageEditorProvider."
    );
  }

  return context;
}