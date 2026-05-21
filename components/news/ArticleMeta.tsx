interface Props {
  author: string;
  date: string;
}

export default function ArticleMeta({
  author,
  date,
}: Props) {
  return (
    <div className="article-meta">
      <span>{author}</span>

      <span>•</span>

      <span>
        {new Date(
          date
        ).toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )}
      </span>
    </div>
  );
}