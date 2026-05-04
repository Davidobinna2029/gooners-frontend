import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secret = req.headers.get("x-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid" });
  }

  revalidatePath("/");
  revalidatePath("/news");

  return NextResponse.json({ revalidated: true });
}