import { WorkflowStatus } from "./workflow";
import { canTransition } from "./workflow.engine";
import { hasPermission } from "../rbac/guard";
import { logAction } from "./audit.store";
import { Role } from "../rbac/types";

export interface ContentOverride {
  postId: number;
  type: string;
  value?: number | null;
  reason?: string | null;
}

export function changePostStatus(params: {
  role: Role;
  userId: string;
  postId: number;
  from: WorkflowStatus;
  to: WorkflowStatus;
}) {
  const {
    role,
    userId,
    postId,
    from,
    to,
  } = params;

  if (
    !hasPermission(
      role,
      "publish"
    )
  ) {
    throw new Error(
      "Insufficient permissions"
    );
  }

  if (
    !canTransition(
      from,
      to
    )
  ) {
    throw new Error(
      `Invalid workflow transition: ${from} → ${to}`
    );
  }

  logAction({
    id: crypto.randomUUID(),
    userId,
    action: "CHANGE_STATUS",
    targetId: postId,
    metadata: {
      from,
      to,
    },
    createdAt:
      new Date().toISOString(),
  });

  return to;
}

export function applyOverride(params: {
  role: Role;
  userId: string;
  override: ContentOverride;
}) {
  const {
    role,
    userId,
    override,
  } = params;

  if (
    !hasPermission(
      role,
      "override"
    )
  ) {
    throw new Error(
      "Insufficient permissions"
    );
  }

  logAction({
    id: crypto.randomUUID(),
    userId,
    action:
      "APPLY_OVERRIDE",
    targetId:
      override.postId,
    metadata: {
      postId:
        override.postId,
      type:
        override.type,
      value:
        override.value,
      reason:
        override.reason,
    },
    createdAt:
      new Date().toISOString(),
  });

  return override;
}