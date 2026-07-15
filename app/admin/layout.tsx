import Link from "next/link";
import "@/styles/admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Newsroom Control</h2>
        </div>

        <nav className="admin-nav">
          <Link href="/admin">
            Dashboard
          </Link>

          <Link href="/admin/workflow">
            Workflow Board
          </Link>

          <Link href="/admin/breaking">
            Breaking News
          </Link>

          <Link href="/admin/overrides">
            Overrides
          </Link>

          <Link href="/admin/audit">
            Audit Logs
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}