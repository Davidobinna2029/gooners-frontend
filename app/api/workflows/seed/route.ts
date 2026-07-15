import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const workflow = await prisma.workflow.create({
    data: {
      postId: 1001,
      status: "DRAFT",
      updatedBy: "admin",
    },
  });

  return Response.json(workflow);
}