export interface MediaImage {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Canonical Post (ESPN CORE MODEL)
 */
export interface CanonicalPost {
  id: number;
  slug: string;
  date: string;

  title: string;
  excerpt: string;

  content?: string;

  image: MediaImage | null;

  categories: number[];
  tags: number[];

  link?: string;

  score: number;

  cluster?: "arsenal" | "transfer" | "injury" | "match" | "other";
}