interface WorkflowCardProps {
  post: {
    id: number;
    title: string;
    author?: string;
    updatedAt?: string;
  };
}

export default function WorkflowCard({
  post,
}: WorkflowCardProps) {
  return (
    <div className="workflow-card">
      <h4>{post.title}</h4>

      <p>
        {post.author ??
          "Unknown Author"}
      </p>

      <small>
        {post.updatedAt
          ? new Date(
              post.updatedAt
            ).toLocaleString()
          : "No update date"}
      </small>
    </div>
  );
}