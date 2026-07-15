export interface ContentOverride {
  id?: string;
  postId: number;
  type:
    | "PIN_TO_HERO"
    | "HERO_POSITION"
    | "FORCE_BREAKING"
    | "BOOST_SCORE"
    | "BLOCK_POST"
    | "HIDE_POST";
  value?: number | null;
  reason?: string | null;
  expiresAt?: number | Date | null;
}

export function applyOverrides(
  posts: any[],
  overrides: ContentOverride[]
) {
  let result = [...posts];

  const now = Date.now();

  const activeOverrides =
    overrides.filter(
      (override) => {
        if (
          !override.expiresAt
        ) {
          return true;
        }

        const expiresAt =
          override.expiresAt instanceof
          Date
            ? override.expiresAt.getTime()
            : new Date(
                override.expiresAt
              ).getTime();

        return (
          expiresAt > now
        );
      }
    );

  const blockedIds =
    activeOverrides
      .filter(
        (override) =>
          override.type ===
          "BLOCK_POST"
      )
      .map(
        (override) =>
          override.postId
      );

  result = result.filter(
    (post) =>
      !blockedIds.includes(
        post.id
      )
  );

  const hiddenIds =
    activeOverrides
      .filter(
        (override) =>
          override.type ===
          "HIDE_POST"
      )
      .map(
        (override) =>
          override.postId
      );

  result = result.filter(
    (post) =>
      !hiddenIds.includes(
        post.id
      )
  );

  const pinnedIds =
    activeOverrides
      .filter(
        (override) =>
          override.type ===
          "PIN_TO_HERO"
      )
      .map(
        (override) =>
          override.postId
      );

  const pinned =
    result.filter(
      (post) =>
        pinnedIds.includes(
          post.id
        )
    );

  const rest =
    result.filter(
      (post) =>
        !pinnedIds.includes(
          post.id
        )
    );

  const breakingBoosted =
    activeOverrides.filter(
      (override) =>
        override.type ===
        "FORCE_BREAKING"
    );

  const boostedMap =
    new Map(
      breakingBoosted.map(
        (override) => [
          override.postId,
          override.value ??
            999,
        ]
      )
    );

  const scored =
    rest.map((post) => ({
      ...post,
      overrideScore:
        boostedMap.get(
          post.id
        ) ?? 0,
    }));

  return [
    ...pinned,
    ...scored,
  ];
}