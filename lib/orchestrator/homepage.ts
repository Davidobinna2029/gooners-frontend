import { classifyPost } from "./classify";

import { rankPosts } from "./rank";

export function buildHomepage(
  posts: any[]
) {
  /**
   * ENRICH POSTS
   */
  const enriched = posts.map(
    (post) => ({
      ...post,

      meta: classifyPost(post),
    })
  );

  /**
   * RANK POSTS
   */
  const ranked =
    rankPosts(enriched);

  /**
   * HERO STORY
   */
  const hero =
    ranked[0] || null;

  /**
   * FEATURED STORIES
   */
  const featured =
    ranked.slice(1, 5);

  /**
   * TRENDING STORIES
   */
  const trending =
    ranked.slice(0, 6);

  /**
   * CATEGORY RAILS
   */
  const transferNews =
    ranked.filter(
      (post) =>
        post.meta.isTransfer
    );

  const injuryNews =
    ranked.filter(
      (post) =>
        post.meta.isInjury
    );

  const uclNews =
    ranked.filter(
      (post) => post.meta.isUCL
    );

  /**
   * FINAL HOMEPAGE OBJECT
   */
  return {
    hero,

    featured,

    trending,

    rails: {
      transferNews,
      injuryNews,
      uclNews,
    },
  };
}