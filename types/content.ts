export interface MediaImage {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Canonical Post (STRICT ESPN CORE MODEL)
 */
export interface CanonicalPost {
  id: number;
  slug: string;
  date: string;

  title: string;
  excerpt: string;

  content?: string;

  image: MediaImage; // 🔥 LOCKED TYPE (NO STRING EVER)

  categories: number[];
  tags: number[];

  link?: string;

  score: number;

  cluster?: "arsenal" | "transfer" | "injury" | "match" | "other";
}