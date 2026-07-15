import { prisma } from "@/lib/db/prisma";

export async function logAudit(data: {
  userId: string;
  action: string;
  targetId?: number;
  metadata?: any;
}) {
  return prisma.auditLog.create({
    data,
  });
}

export async function getAuditLogs() {
  return prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
}