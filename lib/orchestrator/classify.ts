export function classifyPost(post: any) {
  const title =
    post.title?.toLowerCase() || "";

  const categories =
    post.categories || [];

  const categoryNames =
    categories.map((c: any) =>
      c.name?.toLowerCase()
    );

  return {
    /**
     * CATEGORY FLAGS
     */
    isTransfer:
      categoryNames.includes(
        "transfer news"
      ),

    isInjury:
      categoryNames.includes(
        "injury news"
      ),

    isUCL:
      categoryNames.includes("ucl") ||
      categoryNames.includes(
        "champions league"
      ),

    isOpinion:
      categoryNames.includes(
        "opinions"
      ),

    /**
     * BREAKING DETECTION
     */
    isBreaking:
      title.includes("breaking") ||
      title.includes("official") ||
      title.includes("confirmed") ||
      title.includes("done deal"),

    /**
     * MANUAL SCORE PLACEHOLDER
     */
    score: 0,
  };
}