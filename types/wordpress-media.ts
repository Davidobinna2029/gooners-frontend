// types/wordpress-media.ts

import { WordPressPost } from "./wordpress";

/**
 * Featured media structure from WP REST API (_embed=1)
 */
export interface WPFeaturedMedia {
  id?: number;
  source_url?: string;
  media_type?: string;
  mime_type?: string;

  alt_text?: string;

  media_details?: {
    width?: number;
    height?: number;

    sizes?: Record<
      string,
      {
        source_url?: string;
        width?: number;
        height?: number;
      }
    >;
  };
}

/**
 * Embedded WordPress relations (_embed=1)
 */
export interface WPEmbedded {
  "wp:featuredmedia"?: WPFeaturedMedia[];
  author?: any[];
  "wp:term"?: any[];
}

/**
 * Extended post used ONLY when _embed=1 is enabled
 */
export interface WordPressPostWithMedia extends WordPressPost {
  _embedded?: WPEmbedded;
}