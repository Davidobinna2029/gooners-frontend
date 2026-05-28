import type { NormalizedPost } from "@/lib/mappers/wordpressMapper";

export type HomepageFeed = {
  hero: NormalizedPost[];
  trending: NormalizedPost[];
  editors: NormalizedPost[];
  transfer: NormalizedPost[];
  featured: NormalizedPost[];
  breaking: NormalizedPost[];
};

export function buildHomepageFeed(posts: NormalizedPost[]): HomepageFeed {
  return {
    hero: posts.slice(0, 5),
    trending: posts.slice(5, 15),
    editors: posts.slice(15, 25),
    transfer: posts.filter(p =>
      p.title?.toLowerCase().includes("transfer")
    ),
    featured: posts.slice(25, 35),
    breaking: posts.slice(0, 6),
  };
}