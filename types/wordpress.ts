export interface WordPressRendered {
  rendered: string;
}

export interface WordPressAuthor {
  name: string;
}

export interface WordPressMedia {
  source_url: string;
}

export interface WordPressTerm {
  name: string;
  slug: string;
}

export interface WordPressPost {
  id: number;

  slug: string;

  date: string;

  title: WordPressRendered;

  excerpt: WordPressRendered;

  content: WordPressRendered;

  featuredImage: string;

  category: string;

  author: string;
}