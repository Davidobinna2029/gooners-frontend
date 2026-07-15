import type { HomepageLayout } from "@/lib/homepage/layout";
import { HomepageMode } from "./mode";

/**
 * Homepage Mode Engine
 *
 * Takes the automatically generated homepage layout
 * and adjusts it depending on the current homepage mode.
 *
 * NOTE:
 * This version is intentionally conservative.
 * It doesn't rearrange your homepage yet—it only exposes
 * the active mode. We'll add richer transformations in the
 * next iterations.
 */

export interface HomepageModeResult {
  mode: HomepageMode;
  layout: HomepageLayout;
}

export function applyHomepageMode(
  mode: HomepageMode,
  layout: HomepageLayout
): HomepageModeResult {
  switch (mode) {
    case HomepageMode.MATCHDAY_PRE:
      return {
        mode,
        layout,
      };

    case HomepageMode.LIVE_MATCH:
      return {
        mode,
        layout,
      };

    case HomepageMode.HALF_TIME:
      return {
        mode,
        layout,
      };

    case HomepageMode.FULL_TIME:
      return {
        mode,
        layout,
      };

    case HomepageMode.POST_MATCH:
      return {
        mode,
        layout,
      };

    case HomepageMode.TRANSFER_DEADLINE:
      return {
        mode,
        layout,
      };

    case HomepageMode.BREAKING_NEWS:
      return {
        mode,
        layout,
      };

    case HomepageMode.NORMAL:
    default:
      return {
        mode: HomepageMode.NORMAL,
        layout,
      };
  }
}