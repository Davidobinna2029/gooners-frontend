export function rankPosts(posts: any[], overrides: any[] = []) {
  const overrideMap = new Map<number, any>();

  overrides.forEach((o) => {
    overrideMap.set(o.postId, o);
  });

  return posts
    .map((post) => {
      const override = overrideMap.get(post.id);

      let score = post.score || 0;

      if (override) {
        switch (override.type) {
          case "PIN_TO_HERO":
            score += 1000;
            break;

          case "FORCE_BREAKING":
            score += 800;
            break;

          case "BOOST_SCORE":
            score += (override.value || 50);
            break;

          case "BLOCK_POST":
            score -= 9999;
            break;
        }
      }

      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score);
}