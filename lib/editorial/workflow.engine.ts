import { WorkflowStatus } from "./workflow";
import { WORKFLOW_TRANSITIONS } from "./workflow.rules";

export function canTransition(
  from: WorkflowStatus,
  to: WorkflowStatus
): boolean {
  return WORKFLOW_TRANSITIONS[from]?.includes(to);
}