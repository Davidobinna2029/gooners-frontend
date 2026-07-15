import WorkflowCard from "./WorkflowCard";

export default function WorkflowColumn({ title, posts }: any) {
  return (
    <div className="bg-white rounded-xl shadow p-3 min-w-[260px]">
      <h2 className="font-semibold mb-3">{title}</h2>

      <div className="space-y-3">
        {posts.map((p: any) => (
          <WorkflowCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}