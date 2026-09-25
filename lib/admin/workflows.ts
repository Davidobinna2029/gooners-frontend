export type WorkflowStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

export interface Workflow {
  id: string;
  postId: number;
  status: WorkflowStatus;
  updatedBy: string;
  updatedAt: string;

  // WordPress article data
  title: string;
  slug: string | null;
  author: string;
  category: string;
  image: string | null;
  articleUrl: string | null;
}

export async function getWorkflows(): Promise<Workflow[]> {
  const res = await fetch("/api/workflows", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workflows");
  }

  return res.json();
}

export async function updateWorkflow(
  id: string,
  status: WorkflowStatus
) {
  const res = await fetch(`/api/workflows/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update workflow");
  }

  return res.json();
}