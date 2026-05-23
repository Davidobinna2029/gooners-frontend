export interface NormalizedPost {
  id: number;
  slug: string;
  date: string;

  title: string;
  excerpt: string;

  image: string;

  categories?: number[];
  tags?: number[];

  score?: number;
}