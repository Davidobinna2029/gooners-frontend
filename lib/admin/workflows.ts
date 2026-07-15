export interface Workflow {
  id: string;
  postId: number;
  status:
    | "DRAFT"
    | "IN_REVIEW"
    | "APPROVED"
    | "PUBLISHED"
    | "REJECTED";
  updatedBy: string;
  updatedAt: string;
}

export async function getWorkflows(): Promise<Workflow[]> {
  const res = await fetch("/api/workflows");

  if (!res.ok) {
    throw new Error("Failed to fetch workflows");
  }

  return res.json();
}

export async function updateWorkflow(
  id: string,
  status: Workflow["status"]
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