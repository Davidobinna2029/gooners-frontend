"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PostSearch({
  value,
  onChange,
}: Props) {
  return (
    <input
      type="text"
      placeholder="Search articles..."
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="post-search"
    />
  );
}