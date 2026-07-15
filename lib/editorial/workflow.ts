import { prisma } from "@/lib/db/prisma";
import { broadcast } from "@/lib/events/eventBus";

export type WorkflowStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

/**
 * UPDATE OR CREATE WORKFLOW STATE
 */
export async function updateWorkflow(
  postId: number,
  status: WorkflowStatus,
  userId: string
) {
  const workflow = await prisma.workflow.upsert({
    where: { postId },
    update: {
      status,
      updatedBy: userId,
      updatedAt: new Date(),
    },
    create: {
      postId,
      status,
      updatedBy: userId,
    },
  });

  // LIVE BROADCAST
  broadcast("workflow", {
    postId,
    status,
    updatedBy: userId,
    timestamp: Date.now(),
  });

  return workflow;
}

/**
 * GET SINGLE WORKFLOW
 */
export async function getWorkflow(postId: number) {
  return prisma.workflow.findUnique({
    where: { postId },
  });
}

/**
 * GET ALL WORKFLOWS
 */
export async function getAllWorkflows() {
  return prisma.workflow.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
}