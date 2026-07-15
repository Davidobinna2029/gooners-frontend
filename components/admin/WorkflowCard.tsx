interface WorkflowCardProps {
  post: {
    id: number;
    title: string;
    author: string;
    updatedAt: string;
    status?: string;
  };
}

export default function WorkflowCard({
  post,
}: WorkflowCardProps) {
  return (
    <div className="workflow-card">

      <div className="workflow-header">

        <h4>
          {post.title}
        </h4>

        {post.status && (
          <span
            className={`workflow-status workflow-${post.status.toLowerCase()}`}
          >
            {post.status}
          </span>
        )}

      </div>

      <div className="workflow-meta">

        <div>
          <strong>
            Post ID:
          </strong>{" "}
          #{post.id}
        </div>

        <div>
          <strong>
            Author:
          </strong>{" "}
          {post.author}
        </div>

      </div>

      <div
        className="workflow-footer"
        style={{
          marginTop: 12,
          fontSize: 12,
          opacity: 0.75,
        }}
      >
        Updated{" "}
        {new Date(
          post.updatedAt
        ).toLocaleString()}
      </div>

    </div>
  );
}