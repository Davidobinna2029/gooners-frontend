interface Props {
  author?: string;
  date: string;
}

export default function ArticleMeta({
  author,
  date,
}: Props) {
  return (
    <div className="article-meta">

      {author && (
        <span>
          By {author}
        </span>
      )}

      <span>
        {new Date(date).toLocaleDateString()}
      </span>

    </div>
  );
}