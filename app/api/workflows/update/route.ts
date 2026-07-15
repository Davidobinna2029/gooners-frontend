import { prisma } from "@/lib/db/prisma";
import { clearHomepageCache } from "@/lib/homepage/cache";

export async function POST(req: Request) {
  try {
    const { postId, status } =
      await req.json();

    const updated =
      await prisma.workflow.update({
        where: {
          postId,
        },
        data: {
          status,
          updatedAt:
            new Date(),
        },
      });

    /**
     * Editorial workflow changed.
     * Rebuild homepage on the next request.
     */
    clearHomepageCache();

    console.log(
      "Homepage cache cleared after workflow update."
    );

    return Response.json(
      updated,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Workflow update failed:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to update workflow",
      },
      {
        status: 500,
      }
    );
  }
}