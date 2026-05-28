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
        sizes?: Record<string, { source_url?: string }>;
      };
    }>;
  };
}