export interface WordPressMediaSize {
  source_url?: string;
  width?: number;
  height?: number;
}

export interface WordPressAuthor {
  id?: number;
  name?: string;
  slug?: string;
}

export interface WordPressTerm {
  id?: number;
  name?: string;
  taxonomy?: string;
}

export interface WordPressFeaturedMedia {
  id?: number;
  source_url?: string;

  media_details?: {
    width?: number;
    height?: number;

    sizes?: Record<
      string,
      WordPressMediaSize
    >;
  };
}

export interface WordPressPostWithMedia {
  /**
   * =========================
   * CORE POST DATA
   * =========================
   */
  id: number;

  slug: string;

  date: string;

  modified?: string;

  author?: number;

  sticky?: boolean;

  /**
   * =========================
   * RENDERED CONTENT
   * =========================
   */
  title?: {
    rendered?: string;
  };

  excerpt?: {
    rendered?: string;
  };

  content?: {
    rendered?: string;
  };

  /**
   * =========================
   * TAXONOMIES
   * =========================
   */
  categories?: number[];

  tags?: number[];

  /**
   * =========================
   * WORDPRESS META
   * =========================
   */
  guid?: {
    rendered?: string;
  };

  link?: string;

  /**
   * =========================
   * EMBEDDED RELATIONSHIPS
   * =========================
   */
  _embedded?: {
    /**
     * Featured Image
     */
    "wp:featuredmedia"?: WordPressFeaturedMedia[];

    /**
     * Authors
     */
    author?: WordPressAuthor[];

    /**
     * Categories / Tags
     */
    "wp:term"?: WordPressTerm[][];
  };
}