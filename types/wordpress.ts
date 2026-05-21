export interface WordPressPost {
  id: number;
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featuredImage: string;
  category: string;   // singular string
  author: string;
}