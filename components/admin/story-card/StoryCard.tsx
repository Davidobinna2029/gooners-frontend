"use client";

import StoryCardImage from "./StoryCardImage";
import StoryCardMeta from "./StoryCardMeta";
import StoryCardBadge from "./StoryCardBadge";
import StoryCardFooter from "./StoryCardFooter";
import StoryCardActions from "./StoryCardActions";

import type { StoryCardPost } from "./types";

interface Props {
  post: StoryCardPost;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  compact?: boolean;
}

export default function StoryCard({
  post,
  actions,
  footer,
  compact = false,
}: Props) {
  return (
    <div
      className={
        compact
          ? "story-card compact"
          : "story-card"
      }
    >
      <StoryCardImage
        image={post.image}
        title={post.title}
        compact={compact}
      />

      <div className="story-card-body">

        <h3 className="story-card-title">
          {post.title}
        </h3>

        <StoryCardMeta
          category={post.category}
          author={post.author}
          date={post.date}
        />

        <StoryCardBadge
          heroSlot={post.heroSlot}
          breaking={post.breaking}
          trending={post.trending}
          status={post.status}
        />

        {actions && (
          <StoryCardActions>
            {actions}
          </StoryCardActions>
        )}

        {footer && (
          <StoryCardFooter>
            {footer}
          </StoryCardFooter>
        )}

      </div>
    </div>
  );
}