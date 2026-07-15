import { NextResponse } from "next/server";
import { updateWorkflow } from "@/lib/editorial/workflow";

export async function GET() {
  const result = await updateWorkflow(1, "PUBLISHED", "admin-test");

  return NextResponse.json(result);
}