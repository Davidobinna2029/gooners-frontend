"use client";

interface Props {
  children?: React.ReactNode;
}

export default function StoryCardFooter({
  children,
}: Props) {
  return (
    <div className="story-card-footer">
      {children}
    </div>
  );
}