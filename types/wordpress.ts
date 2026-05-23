export interface WordPressPost {
  id: number;
  date: string;
  slug: string;

  title: {
    rendered: string;
  };

  excerpt?: {
    rendered: string;
  };

  content?: {
    rendered: string;
  };

  categories?: number[];
  tags?: number[];

  acf?: Record<string, any>;

  // ✅ ADD THIS (fixes your error)
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
    }>;
  };
}