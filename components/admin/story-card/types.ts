export interface StoryCardPost {
  id: number;
  title: string;
  slug?: string;
  image?: string | null;
  category?: string;
  author?: string;
  date?: string;
  status?: string;
  heroSlot?: number | null;
  breaking?: boolean;
  trending?: boolean;
}