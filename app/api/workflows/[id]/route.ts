import { prisma } from "@/lib/db/prisma";
import { clearHomepageCache } from "@/lib/homepage/cache";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const workflow =
      await prisma.workflow.findUnique({
        where: {
          id,
        },
      });

    if (!workflow) {
      return Response.json(
        {
          error: "Workflow not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(workflow);
  } catch (error) {
    return Response.json(
      {
        error:
          "Failed to fetch workflow",
        details:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body =
      await request.json();

    const workflow =
      await prisma.workflow.update({
        where: {
          id,
        },
        data: {
          ...body,
          updatedAt:
            new Date(),
        },
      });

    clearHomepageCache();

    return Response.json(workflow);
  } catch (error) {
    return Response.json(
      {
        error:
          "Failed to update workflow",
        details:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await prisma.workflow.delete({
      where: {
        id,
      },
    });

    clearHomepageCache();

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          "Failed to delete workflow",
        details:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}