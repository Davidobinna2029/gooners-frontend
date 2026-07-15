import type { HomepageFeed } from "@/lib/orchestrator/homepage";

interface HomepageCacheState {
  homepage: HomepageFeed | null;
  lastUpdated: number;
}

const TTL = 30 * 1000;

const state: HomepageCacheState = {
  homepage: null,
  lastUpdated: 0,
};

export function getHomepageCache(): HomepageFeed | null {
  if (!state.homepage) {
    return null;
  }

  const expired =
    Date.now() - state.lastUpdated > TTL;

  if (expired) {
    return null;
  }

  return state.homepage;
}

export function setHomepageCache(
  homepage: HomepageFeed
) {
  state.homepage = homepage;
  state.lastUpdated = Date.now();
}

export function clearHomepageCache() {
  state.homepage = null;
  state.lastUpdated = 0;
}

export function getHomepageCacheInfo() {
  return {
    hasCache: state.homepage !== null,
    lastUpdated: state.lastUpdated,
    age:
      state.lastUpdated === 0
        ? null
        : Date.now() - state.lastUpdated,
    expiresIn:
      state.lastUpdated === 0
        ? null
        : Math.max(
            0,
            TTL -
              (Date.now() -
                state.lastUpdated)
          ),
  };
}