import { prisma } from "@/lib/db/prisma";
import { clearHomepageCache } from "@/lib/homepage/cache";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    await prisma.override.delete({
      where: {
        id,
      },
    });

    /**
     * Homepage should rebuild
     * on the next request.
     */
    clearHomepageCache();

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          "Failed to delete override",
        details:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}