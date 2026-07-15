import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";

export default async function AuditPage() {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/login");
  }

  const role =
    (session.user as any)?.role;

  if (!isAdmin(role)) {
    redirect("/admin");
  }

  const logs =
    await prisma.auditLog.findMany({
      include: {
        user: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,
    });

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <h1>Audit Logs</h1>

          <p>
            Track every important
            newsroom action.
          </p>
        </header>

        <div className="admin-card">
          <table
            style={{
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    {new Date(
                      log.createdAt
                    ).toLocaleString()}
                  </td>

                  <td>
                    {
                      log.user.email
                    }
                  </td>

                  <td>
                    {log.action}
                  </td>

                  <td>
                    <pre
                      style={{
                        whiteSpace:
                          "pre-wrap",
                        fontSize:
                          "12px",
                      }}
                    >
                      {JSON.stringify(
                        log.metadata,
                        null,
                        2
                      )}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}