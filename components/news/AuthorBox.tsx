interface Props {
  author?: string;
}

export default function AuthorBox({
  author,
}: Props) {
  return (
    <div className="author-box">

      <h3>
        About the Author
      </h3>

      <p>
        {author ||
          "ArsenalTalks Editorial Team"}
      </p>

    </div>
  );
}