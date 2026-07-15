"use client";

interface Props {
  category?: string;
  author?: string;
  date?: string;
}

export default function StoryCardMeta({
  category,
  author,
  date,
}: Props) {
  return (
    <div className="story-card-meta">

      {category && (
        <span>{category}</span>
      )}

      {author && (
        <span>{author}</span>
      )}

      {date && (
        <span>
          {new Date(date).toLocaleString()}
        </span>
      )}

    </div>
  );
}