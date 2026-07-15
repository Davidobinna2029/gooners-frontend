import WorkflowCard from "./WorkflowCard";

interface WorkflowPost {
  id: number;
  title: string;
  author: string;
  updatedAt: string;
  status?: string;
}

interface Props {
  title: string;
  posts: WorkflowPost[];
}

export default function WorkflowColumn({
  title,
  posts,
}: Props) {
  return (
    <div className="workflow-column">

      <div className="workflow-column-header">

        <h3>
          {title}
        </h3>

        <span className="workflow-count">
          {posts.length}
        </span>

      </div>

      {posts.length === 0 ? (
        <div className="workflow-empty">
          No stories
        </div>
      ) : (
        <div className="workflow-column-content">

          {posts.map((post) => (
            <WorkflowCard
              key={post.id}
              post={post}
            />
          ))}

        </div>
      )}

    </div>
  );
}