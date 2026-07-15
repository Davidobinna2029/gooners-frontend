import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";

import CreateUserForm from "@/components/admin/CreateUserForm";
import UserActions from "@/components/admin/UserActions";

export default async function UsersPage() {
  const session =
    await getServerSession(
      authOptions
    );

  const role =
    (session?.user as any)?.role;

  if (!session) {
    redirect("/login");
  }

  if (!canManageUsers(role)) {
    redirect("/admin");
  }

  const users =
    await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  const currentUserId =
    (session.user as any).id;

  const ownerCount =
    users.filter(
      (u) => u.role === "OWNER"
    ).length;

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <h1>
            User Management
          </h1>

          <p>
            Manage newsroom users,
            permissions and editorial
            access levels.
          </p>
        </header>

        <section className="admin-grid">
          <div className="admin-main">
            <CreateUserForm />

            <div className="admin-card">
              <h2>
                Registered Users
              </h2>

              {users.length === 0 ? (
                <p>
                  No users found.
                </p>
              ) : (
                <div className="users-list">
                  {users.map(
                    (user) => (
                      <div
                        key={user.id}
                        className="user-card"
                      >
                        <div className="user-card-header">
                          <div>
                            <h3>
                              {
                                user.email
                              }
                            </h3>

                            <p>
                              Role:{" "}
                              <strong>
                                {
                                  user.role
                                }
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="user-meta">
                          <small>
                            User ID:{" "}
                            {
                              user.id
                            }
                          </small>

                          <br />

                          <small>
                            Created:{" "}
                            {new Date(
                              user.createdAt
                            ).toLocaleString()}
                          </small>
                        </div>

                        <div
                          style={{
                            marginTop:
                              "12px",
                          }}
                        >
                          <UserActions
                            id={user.id}
                            role={user.role}
                            currentUserId={
                              currentUserId
                            }
                            currentUserRole={
                              role
                            }
                            ownerCount={
                              ownerCount
                            }
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="admin-sidebar">
            <div className="admin-card">
              <h3>
                User Roles
              </h3>

              <ul>
                <li>OWNER</li>
                <li>ADMIN</li>
                <li>EDITOR</li>
                <li>WRITER</li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>
                Permissions
              </h3>

              <ul>
                <li>
                  OWNER: Full
                  access
                </li>

                <li>
                  ADMIN:
                  Editorial &
                  Homepage
                </li>

                <li>
                  EDITOR:
                  Workflow
                  approval
                </li>

                <li>
                  WRITER:
                  Content
                  creation
                </li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>
                User Controls
              </h3>

              <ul>
                <li>
                  Create Users
                </li>

                <li>
                  Update Roles
                </li>

                <li>
                  Delete Accounts
                </li>

                <li>
                  Audit Tracking
                </li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>
                Security
              </h3>

              <ul>
                <li>
                  Owner-only
                  page
                </li>

                <li>
                  Role-based
                  access
                </li>

                <li>
                  Session
                  protected
                </li>

                <li>
                  Audit ready
                </li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>
                System Status
              </h3>

              <ul>
                <li>
                  User Engine ✓
                </li>

                <li>
                  Role Engine ✓
                </li>

                <li>
                  Permissions ✓
                </li>

                <li>
                  Session Auth ✓
                </li>

                <li>
                  Owner Access ✓
                </li>

                <li>
                  Create User ✓
                </li>

                <li>
                  Owner Protection ✓
                </li>

                <li>
                  Role Protection ✓
                </li>
              </ul>
            </div>

            <div className="admin-card">
              <h3>
                Coming Next
              </h3>

              <ul>
                <li>
                  Audit Logs
                </li>

                <li>
                  User Activity
                </li>

                <li>
                  Role History
                </li>

                <li>
                  Invite Users
                </li>

                <li>
                  Password Reset
                </li>

                <li>
                  User Analytics
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}