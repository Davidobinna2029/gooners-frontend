import WorkflowActions from "./WorkflowActions";

export default function WorkflowCard({ post }: any) {
  return (
    <div className="border rounded-lg p-3 bg-gray-50 hover:bg-white transition">
      <h3 className="font-medium text-sm line-clamp-2">
        Post #{post.postId}
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        Updated: {new Date(post.updatedAt).toLocaleString()}
      </p>

      <WorkflowActions post={post} />
    </div>
  );
}