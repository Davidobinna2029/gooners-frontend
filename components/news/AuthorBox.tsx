interface Props {
  author: string;
}

export default function AuthorBox({
  author,
}: Props) {
  return (
    <div className="author-box">
      <div className="author-avatar">
        AT
      </div>

      <div>
        <h3>{author}</h3>

        <p>
          ArsenalTalks football
          writer covering Arsenal,
          transfers, tactical
          analysis and breaking
          Premier League news.
        </p>
      </div>
    </div>
  );
}