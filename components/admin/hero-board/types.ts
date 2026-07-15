export interface HeroStory {
  id: number;
  title: string;
  image?: string | null;
  category?: string;
  author?: string;
  date?: string;
  slot?: number | null;
}