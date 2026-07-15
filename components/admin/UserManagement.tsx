"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Props {
  users: User[];
}

export default function UserManagement({
  users,
}: Props) {
  const router = useRouter();

  const [loading, startTransition] =
    useTransition();

  async function updateRole(
    id: string,
    role: string
  ) {
    await fetch(
      `/api/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          role,
        }),
      }
    );

    startTransition(() => {
      router.refresh();
    });
  }

  async function deleteUser(
    id: string
  ) {
    const confirmed =
      confirm(
        "Delete this user?"
      );

    if (!confirmed) return;

    await fetch(
      `/api/users/${id}`,
      {
        method: "DELETE",
      }
    );

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="users-list">
      {users.map((user) => (
        <div
          key={user.id}
          className="user-card"
        >
          <div>
            <h3>{user.email}</h3>

            <p>
              Role:
              {" "}
              <strong>
                {user.role}
              </strong>
            </p>

            <small>
              Created:
              {" "}
              {new Date(
                user.createdAt
              ).toLocaleString()}
            </small>
          </div>

          <div className="user-actions">
            <select
              defaultValue={
                user.role
              }
              onChange={(e) =>
                updateRole(
                  user.id,
                  e.target.value
                )
              }
              disabled={loading}
            >
              <option value="WRITER">
                WRITER
              </option>

              <option value="EDITOR">
                EDITOR
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

              <option value="OWNER">
                OWNER
              </option>
            </select>

            <button
              onClick={() =>
                deleteUser(
                  user.id
                )
              }
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}