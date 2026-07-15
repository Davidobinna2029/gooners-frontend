export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db/prisma";

export default async function WorkflowPage() {
  let workflows: any[] = [];

  try {
    workflows =
      await prisma.workflow.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      });
  } catch (error) {
    console.error(
      "Failed to load workflows:",
      error
    );
  }

  const grouped = {
    DRAFT: workflows.filter(
      (w) => w.status === "DRAFT"
    ),
    IN_REVIEW: workflows.filter(
      (w) =>
        w.status === "IN_REVIEW"
    ),
    APPROVED: workflows.filter(
      (w) =>
        w.status === "APPROVED"
    ),
    PUBLISHED: workflows.filter(
      (w) =>
        w.status === "PUBLISHED"
    ),
    REJECTED: workflows.filter(
      (w) =>
        w.status === "REJECTED"
    ),
  };

  return (
    <div className="workflow-board">
      {Object.entries(grouped).map(
        ([status, items]) => (
          <div
            key={status}
            className="workflow-column"
          >
            <h3>{status}</h3>

            {items.length === 0 ? (
              <p>
                No items in this
                stage.
              </p>
            ) : (
              items.map((item: any) => (
                <div
                  key={item.id}
                  className="workflow-card"
                >
                  <p>
                    Post ID:{" "}
                    {item.postId}
                  </p>

                  <small>
                    Updated:{" "}
                    {String(
                      item.updatedAt
                    )}
                  </small>

                  <div className="actions">
                    <button>
                      Move
                    </button>

                    <button>
                      Approve
                    </button>

                    <button>
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      )}
    </div>
  );
}