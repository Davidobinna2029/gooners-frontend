"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

interface Props {
  email: string;
  role: string;
}

export default function AdminUserMenu({
  email,
  role,
}: Props) {
  const isOwner =
    role === "OWNER";

  return (
    <div className="admin-user-menu">
      <div className="admin-user-info">
        <strong>{email}</strong>

        <span className="admin-role">
          {role}
        </span>
      </div>

      <div className="admin-user-links">
        <Link href="/admin">
          Dashboard
        </Link>

        <Link href="/admin/workflow">
          Workflow
        </Link>

        <Link href="/admin/overrides">
          Overrides
        </Link>

        <Link href="/admin/audit">
          Audit Logs
        </Link>

        {isOwner && (
          <Link href="/admin/users">
            Users
          </Link>
        )}

        <button
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
        >
          Logout
        </button>
      </div>
    </div>
  );
}