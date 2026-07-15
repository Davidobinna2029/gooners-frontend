import { prisma } from "@/lib/db/prisma";

export async function logAction(
  userId: string,
  action: string,
  targetId?: number,
  metadata?: any
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      targetId,
      metadata,
    },
  });
}