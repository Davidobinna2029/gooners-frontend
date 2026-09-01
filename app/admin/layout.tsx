import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import "@/styles/admin.css";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
children,
}: {
children: React.ReactNode;
}) {
const session = await getServerSession(authOptions);

if (!session?.user) {
redirect("/login");
}

const role = (session.user as { role?: string }).role;

if (!role) {
redirect("/login");
}

const allowedRoles = ["EDITOR", "ADMIN", "OWNER"];

if (!allowedRoles.includes(role)) {
redirect("/");
}

const canManageUsers =
role === "ADMIN" || role === "OWNER";

return ( <div className="admin-layout"> <aside className="admin-sidebar"> <div className="admin-brand"> <h1>ArsenalTalks</h1> <p>Newsroom Control</p> </div>

```
    <div className="admin-user">
      <strong>{session.user.email}</strong>
      <span>{role}</span>
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

      {canManageUsers && (
        <Link href="/admin/users">
          Users
        </Link>
      )}
    </nav>
  </aside>

  <main className="admin-main">
    {children}
  </main>
</div>

);
}
