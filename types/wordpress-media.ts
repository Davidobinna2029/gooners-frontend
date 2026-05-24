export interface WordPressRenderedField {
  rendered: string;
}

export interface WordPressMediaSize {
  source_url?: string;
}

export interface WordPressMediaDetails {
  sizes?: {
    thumbnail?: WordPressMediaSize;
    medium?: WordPressMediaSize;
    large?: WordPressMediaSize;
    full?: WordPressMediaSize;
  };
}

export interface WordPressFeaturedMedia {
  source_url?: string;

  media_details?: WordPressMediaDetails;
}

export interface WordPressEmbedded {
  "wp:featuredmedia"?: WordPressFeaturedMedia[];
}

export interface WordPressPostWithMedia {
  id: number;

  slug: string;

  date: string;

  title?: WordPressRenderedField;

  excerpt?: WordPressRenderedField;

  content?: WordPressRenderedField;

  categories?: number[];

  tags?: number[];

  featured_media?: number;

  _embedded?: WordPressEmbedded;
}