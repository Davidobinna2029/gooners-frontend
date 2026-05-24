export interface WordPressMediaSize {
  source_url?: string;
}

export interface WordPressMedia {
  source_url?: string;
  media_details?: {
    sizes?: {
      thumbnail?: WordPressMediaSize;
      medium?: WordPressMediaSize;
      large?: WordPressMediaSize;
      full?: WordPressMediaSize;
    };
  };
}

export interface WordPressPostWithMedia {
  id: number;
  slug: string;
  date: string;

  title?: { rendered?: string };
  excerpt?: { rendered?: string };

  categories?: number[];
  tags?: number[];

  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
  };
}