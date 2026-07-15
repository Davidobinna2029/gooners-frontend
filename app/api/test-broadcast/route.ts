import { NextResponse } from "next/server";
import { broadcast } from "@/lib/events/eventBus";

export async function GET() {
  broadcast("workflow", {
    postId: 1,
    status: "PUBLISHED",
    updatedBy: "test-user",
    timestamp: Date.now(),
  });

  return NextResponse.json({ ok: true });
}