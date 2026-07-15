import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

/**
 * GET
 * Latest homepage layout
 */
export async function GET() {
  try {
    const layout = await prisma.homepageLayout.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(layout);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load homepage layout." },
      { status: 500 }
    );
  }
}

/**
 * POST
 * Save Draft
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const layout = await prisma.homepageLayout.create({
      data: {
        name: body.name ?? "Homepage Draft",
        status: "draft",
        layout: body.layout,
        createdBy: body.createdBy,
      },
    });

    return NextResponse.json(layout);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save layout." },
      { status: 500 }
    );
  }
}

/**
 * PUT
 * Publish Homepage
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const layout = await prisma.homepageLayout.update({
      where: {
        id: body.id,
      },
      data: {
        status: "published",
        publishedAt: new Date(),
      },
    });

    revalidatePath("/");
    revalidatePath("/news");

    return NextResponse.json(layout);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to publish homepage." },
      { status: 500 }
    );
  }
}