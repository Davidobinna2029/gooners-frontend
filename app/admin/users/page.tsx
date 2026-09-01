import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";

import CreateUserForm from "@/components/admin/CreateUserForm";
import UserActions from "@/components/admin/UserActions";

export default async function UsersPage() {
const session = await getServerSession(authOptions);

if (!session?.user) {
redirect("/login");
}

const role = (session.user as { role?: string }).role;

if (!canManageUsers(role)) {
redirect("/admin");
}

const currentUserId = (session.user as { id?: string }).id;

if (!currentUserId) {
redirect("/login");
}

const users = await prisma.user.findMany({
orderBy: {
createdAt: "desc",
},
select: {
id: true,
email: true,
role: true,
createdAt: true,
},
});

const ownerCount = users.filter(
(user) => user.role === "OWNER"
).length;

return ( <main className="admin-main"> <div className="admin-page"> <header className="admin-page-header"> <div> <h1>User Management</h1>

```
        <p>
          Manage newsroom users, permissions, and editorial
          access levels.
        </p>
      </div>
    </header>

    <section className="admin-grid">
      <div className="admin-main">
        <CreateUserForm />

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Registered Users</h2>

              <p>
                {users.length} registered user
                {users.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="admin-empty-state">
              <h3>No users found</h3>

              <p>
                Create the first newsroom user using the form
                above.
              </p>
            </div>
          ) : (
            <div className="users-list">
              {users.map((user) => {
                const isCurrentUser =
                  user.id === currentUserId;

                const isOwner =
                  user.role === "OWNER";

                return (
                  <div
                    key={user.id}
                    className="user-card"
                  >
                    <div className="user-card-header">
                      <div>
                        <h3>{user.email}</h3>

                        <p>
                          Role:{" "}
                          <strong>{user.role}</strong>
                        </p>
                      </div>

                      {isCurrentUser && (
                        <span className="user-badge">
                          Current User
                        </span>
                      )}

                      {isOwner && (
                        <span className="user-badge">
                          Owner
                        </span>
                      )}
                    </div>

                    <div className="user-meta">
                      <small>
                        User ID: {user.id}
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
                        marginTop: "12px",
                      }}
                    >
                      <UserActions
                        id={user.id}
                        role={user.role}
                        currentUserId={currentUserId}
                        currentUserRole={role}
                        ownerCount={ownerCount}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <aside className="admin-sidebar">
        <div className="admin-card">
          <h3>User Roles</h3>

          <ul>
            <li>OWNER</li>
            <li>ADMIN</li>
            <li>EDITOR</li>
            <li>WRITER</li>
          </ul>
        </div>

        <div className="admin-card">
          <h3>Permissions</h3>

          <ul>
            <li>
              <strong>OWNER</strong>: Full system access
            </li>

            <li>
              <strong>ADMIN</strong>: Editorial and homepage
              management
            </li>

            <li>
              <strong>EDITOR</strong>: Workflow and approval
            </li>

            <li>
              <strong>WRITER</strong>: Content creation
            </li>
          </ul>
        </div>

        <div className="admin-card">
          <h3>User Controls</h3>

          <ul>
            <li>Create users</li>
            <li>Update roles</li>
            <li>Delete accounts</li>
            <li>Audit tracking</li>
          </ul>
        </div>

        <div className="admin-card">
          <h3>Security</h3>

          <ul>
            <li>OWNER-only page</li>
            <li>Role-based access</li>
            <li>Session protected</li>
            <li>Audit ready</li>
          </ul>
        </div>

        <div className="admin-card">
          <h3>System Status</h3>

          <ul>
            <li>User Engine ✓</li>
            <li>Role Engine ✓</li>
            <li>Permissions ✓</li>
            <li>Session Auth ✓</li>
            <li>Owner Access ✓</li>
            <li>Create User ✓</li>
            <li>Owner Protection ✓</li>
            <li>Role Protection ✓</li>
          </ul>
        </div>

        <div className="admin-card">
          <h3>Coming Next</h3>

          <ul>
            <li>Audit Logs</li>
            <li>User Activity</li>
            <li>Role History</li>
            <li>Invite Users</li>
            <li>Password Reset</li>
            <li>User Analytics</li>
          </ul>
        </div>
      </aside>
    </section>
  </div>
</main>

);
}
