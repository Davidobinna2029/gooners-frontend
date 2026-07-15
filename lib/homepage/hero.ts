import type { RankedPost } from "@/lib/engine/ranking";

interface HeroPost extends RankedPost {
  _heroPosition?: number;
}

export function buildHero(
  ranked: RankedPost[]
): RankedPost[] {
  const heroSlots: (RankedPost | null)[] = [
    null,
    null,
    null,
    null,
  ];

  const usedPostIds = new Set<number>();

  for (const post of ranked) {
    const position = (post as HeroPost)._heroPosition;

    if (
      position &&
      position >= 1 &&
      position <= 4
    ) {
      heroSlots[position - 1] = post;
      usedPostIds.add(post.id);
    }
  }

  for (let i = 0; i < heroSlots.length; i++) {
    if (heroSlots[i]) continue;

    const candidate = ranked.find(
      (post) => !usedPostIds.has(post.id)
    );

    if (!candidate) continue;

    heroSlots[i] = candidate;
    usedPostIds.add(candidate.id);
  }

  return heroSlots.filter(
    (post): post is RankedPost => post !== null
  );
}