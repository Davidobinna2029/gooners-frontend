import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost, MediaImage } from "@/types/content";
import { getFeaturedImage } from "@/lib/utils/getFeaturedImage";

export function mapWordPressPost(
  post: WordPressPostWithMedia
): CanonicalPost {
  const imageUrl = getFeaturedImage(post);

  const image: MediaImage | null = imageUrl
    ? {
        url: imageUrl,
      }
    : null;

  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: post.title?.rendered ?? "",
    excerpt: post.excerpt?.rendered ?? "",

    content: post.content?.rendered,

    image,

    categories: post.categories ?? [],
    tags: post.tags ?? [],

    link: post.link,

    score: 0,
    cluster: "other",
  };
}