import WorkflowBoard from "@/components/admin/workflow/WorkflowBoard";

export const dynamic = "force-dynamic";

export default function WorkflowPage() {
  return (
    <main className="p-6">
      <WorkflowBoard />
    </main>
  );
}