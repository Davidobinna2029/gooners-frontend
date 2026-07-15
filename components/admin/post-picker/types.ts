export interface NewsPost {
  id: number;

  slug: string;

  title: string;

  excerpt: string;

  date: string;

  modified: string;

  status: string;

  image: string | null;

  author: string;

  category: string;

  categories: number[];

  featuredMedia: number | null;

  link: string;
}