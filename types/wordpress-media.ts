export interface WordPressMediaSize {
  source_url?: string;
  width?: number;
  height?: number;
}

export interface WordPressPostWithMedia {
  id: number;
  slug: string;
  date: string;

  title?: {
    rendered?: string;
  };

  excerpt?: {
    rendered?: string;
  };

  content?: {
    rendered?: string;
  };

  categories?: number[];
  tags?: number[];

  /**
   * =========================
   * CORE WORDPRESS META
   * =========================
   */

  guid?: {
    rendered?: string;
  };

  link?: string;

  /**
   * =========================
   * FEATURED MEDIA (PRIMARY IMAGE SYSTEM)
   * =========================
   */
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      id?: number;
      source_url?: string;

      media_details?: {
        width?: number;
        height?: number;

        sizes?: Record<string, WordPressMediaSize>;
      };
    }>;
  };
}