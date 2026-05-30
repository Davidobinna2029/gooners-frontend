// /types/wordpress-media.ts

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

  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;

      media_details?: {
        width?: number;
        height?: number;

        sizes?: Record<string, WordPressMediaSize>;
      };
    }>;
  };
}