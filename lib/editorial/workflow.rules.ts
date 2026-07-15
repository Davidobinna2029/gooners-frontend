import { WorkflowStatus } from "./workflow";

export const WORKFLOW_TRANSITIONS: Record<
  WorkflowStatus,
  WorkflowStatus[]
> = {
  DRAFT: ["IN_REVIEW"],
  IN_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["PUBLISHED"],
  REJECTED: ["DRAFT"],
  PUBLISHED: [],
};