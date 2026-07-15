import Link from "next/link";

const actions = [
  {
    title: "New Article",
    href: "/admin/posts/new",
    description:
      "Create a new article",
  },

  {
    title: "User Management",
    href: "/admin/users",
    description:
      "Manage newsroom users",
  },

  {
    title: "Homepage Controls",
    href: "/admin/homepage",
    description:
      "Hero, overrides & rankings",
  },

  {
    title: "Breaking News",
    href: "/admin/breaking",
    description:
      "Manage breaking stories",
  },

  {
    title: "Audit Logs",
    href: "/admin/audit",
    description:
      "Review system activity",
  },

  {
    title: "Workflow",
    href: "/admin/workflow",
    description:
      "Editorial workflow board",
  },
];

export default function NewsroomQuickActions() {
  return (
    <div className="admin-card">
      <h2>Quick Actions</h2>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="quick-action-card"
          >
            <h3>{action.title}</h3>

            <p>
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}