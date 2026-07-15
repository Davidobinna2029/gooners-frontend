import { prisma } from "@/lib/db/prisma";

export async function getOverrides() {
  return prisma.override.findMany();
}

export async function createOverride(data: {
  postId: number;
  type: any;
  value?: number;
  reason?: string;
  createdBy: string;
}) {
  return prisma.override.create({
    data,
  });
}