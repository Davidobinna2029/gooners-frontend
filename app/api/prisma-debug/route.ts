import { prisma } from "@/lib/db/prisma";

export async function GET() {
  return Response.json({
    workflowExists: !!prisma.workflow,
    overrideExists: !!prisma.override,
    userExists: !!prisma.user,
  });
}