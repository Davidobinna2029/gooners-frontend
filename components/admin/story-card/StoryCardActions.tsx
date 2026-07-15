"use client";

interface Props {
  children?: React.ReactNode;
}

export default function StoryCardActions({
  children,
}: Props) {
  return (
    <div className="story-card-actions">
      {children}
    </div>
  );
}