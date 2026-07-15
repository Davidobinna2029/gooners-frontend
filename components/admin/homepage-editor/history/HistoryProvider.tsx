"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type {
  HomepageLayoutState,
} from "../context/HomepageEditorContext";

interface HistoryState {
  past: HomepageLayoutState[];
  present: HomepageLayoutState | null;
  future: HomepageLayoutState[];
}

interface HistoryContextValue {
  history: HistoryState;

  save: (
    layout: HomepageLayoutState
  ) => void;

  undo: () => HomepageLayoutState | null;

  redo: () => HomepageLayoutState | null;

  reset: (
    layout: HomepageLayoutState
  ) => void;

  canUndo: boolean;

  canRedo: boolean;
}

const HistoryContext =
  createContext<HistoryContextValue | null>(
    null
  );

export function HistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [history, setHistory] =
    useState<HistoryState>({
      past: [],
      present: null,
      future: [],
    });

  const save = useCallback(
    (layout: HomepageLayoutState) => {
      setHistory((previous) => {
        if (!previous.present) {
          return {
            past: [],
            present: layout,
            future: [],
          };
        }

        return {
          past: [
            ...previous.past,
            previous.present,
          ],
          present: layout,
          future: [],
        };
      });
    },
    []
  );

  const undo = useCallback(() => {
    let restored: HomepageLayoutState | null =
      null;

    setHistory((previous) => {
      if (
        previous.past.length === 0 ||
        !previous.present
      ) {
        restored = previous.present;

        return previous;
      }

      const past = [
        ...previous.past,
      ];

      restored = past.pop() ?? null;

      return {
        past,
        present: restored,
        future: [
          previous.present,
          ...previous.future,
        ],
      };
    });

    return restored;
  }, []);

  const redo = useCallback(() => {
    let restored: HomepageLayoutState | null =
      null;

    setHistory((previous) => {
      if (
        previous.future.length === 0 ||
        !previous.present
      ) {
        restored = previous.present;

        return previous;
      }

      restored = previous.future[0];

      return {
        past: [
          ...previous.past,
          previous.present,
        ],
        present: restored,
        future:
          previous.future.slice(1),
      };
    });

    return restored;
  }, []);

  const reset = useCallback(
    (
      layout: HomepageLayoutState
    ) => {
      setHistory({
        past: [],
        present: layout,
        future: [],
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      history,
      save,
      undo,
      redo,
      reset,
      canUndo:
        history.past.length > 0,
      canRedo:
        history.future.length > 0,
    }),
    [
      history,
      save,
      undo,
      redo,
      reset,
    ]
  );

  return (
    <HistoryContext.Provider
      value={value}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context =
    useContext(HistoryContext);

  if (!context) {
    throw new Error(
      "useHistory must be used inside HistoryProvider."
    );
  }

  return context;
}