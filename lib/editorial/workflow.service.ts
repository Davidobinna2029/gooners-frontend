import { prisma } from "@/lib/db/prisma";

export async function getWorkflow(postId: number) {
  return prisma.workflow.findFirst({
    where: {
      postId,
    },
  });
}

export async function updateWorkflow(
  postId: number,
  status: any,
  updatedBy: string
) {
  return prisma.workflow.upsert({
    where: {
      postId,
    },
    update: {
      status,
      updatedBy,
    },
    create: {
      postId,
      status,
      updatedBy,
    },
  });
}