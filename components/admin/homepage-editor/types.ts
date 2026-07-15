export interface StoryCard {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
  author?: string;
  category?: string;
  date?: string;
}

export interface HomepageDesignerData {
  stories: StoryCard[];

  hero: StoryCard[];

  breaking: StoryCard[];

  trending: StoryCard[];

  latest: StoryCard[];
}