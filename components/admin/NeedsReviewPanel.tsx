import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function NeedsReviewPanel() {
  const workflows = await prisma.workflow.findMany({
    where: {
      status: "IN_REVIEW",
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  return (
    <div className="admin-card">
      <div className="panel-header">
        <h2>Needs Review</h2>

        <span className="workflow-count">
          {workflows.length}
        </span>
      </div>

      {workflows.length === 0 ? (
        <div className="workflow-empty">
          No articles awaiting review.
        </div>
      ) : (
        <div className="review-list">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="review-item"
            >
              <div>
                <h4>
                  Article #{workflow.postId}
                </h4>

                <small>
                  Updated{" "}
                  {new Date(
                    workflow.updatedAt
                  ).toLocaleString()}
                </small>
              </div>

              <Link
                href={`/admin/posts/${workflow.postId}`}
                className="review-link"
              >
                Open
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}