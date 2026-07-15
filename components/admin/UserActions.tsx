"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  role: string;

  currentUserId: string;
  currentUserRole: string;

  ownerCount: number;
}

export default function UserActions({
  id,
  role,

  currentUserId,
  currentUserRole,

  ownerCount,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const isSelf =
    currentUserId === id;

  const targetIsOwner =
    role === "OWNER";

  const currentIsAdmin =
    currentUserRole === "ADMIN";

  const currentIsOwner =
    currentUserRole === "OWNER";

  const isLastOwner =
    role === "OWNER" &&
    ownerCount <= 1;

  const canModifyRole =
    !(
      currentIsAdmin &&
      targetIsOwner
    );

  async function updateRole(
    newRole: string
  ) {
    if (loading) return;

    const confirmed =
      window.confirm(
        `Change role to ${newRole}?`
      );

    if (!confirmed) return;

    try {
      setLoading(true);
      setMessage("");

      const res =
        await fetch(
          `/api/users/${id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              role: newRole,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to update role"
        );
      }

      setMessage(
        "Role updated successfully."
      );

      router.refresh();
    } catch (error: any) {
      setMessage(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser() {
    if (loading) return;

    const confirmed =
      window.confirm(
        "Delete this user permanently?"
      );

    if (!confirmed) return;

    try {
      setLoading(true);
      setMessage("");

      const res =
        await fetch(
          `/api/users/${id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to delete user"
        );
      }

      setMessage(
        "User deleted."
      );

      router.refresh();
    } catch (error: any) {
      setMessage(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="user-actions"
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {canModifyRole && (
        <>
          <button
            disabled={
              loading ||
              role === "EDITOR"
            }
            onClick={() =>
              updateRole("EDITOR")
            }
          >
            Editor
          </button>

          <button
            disabled={
              loading ||
              role === "ADMIN"
            }
            onClick={() =>
              updateRole("ADMIN")
            }
          >
            Admin
          </button>

          {currentIsOwner && (
            <button
              disabled={
                loading ||
                role === "OWNER"
              }
              onClick={() =>
                updateRole("OWNER")
              }
            >
              Owner
            </button>
          )}
        </>
      )}

      <button
        disabled={
          loading ||
          isSelf ||
          isLastOwner
        }
        onClick={deleteUser}
      >
        Delete
      </button>

      {isSelf && (
        <div
          style={{
            width: "100%",
            fontSize: "12px",
          }}
        >
          You cannot delete your
          own account.
        </div>
      )}

      {currentIsAdmin &&
        targetIsOwner && (
          <div
            style={{
              width: "100%",
              fontSize: "12px",
            }}
          >
            Admins cannot modify
            owner accounts.
          </div>
        )}

      {isLastOwner && (
        <div
          style={{
            width: "100%",
            fontSize: "12px",
          }}
        >
          The last owner account
          cannot be deleted.
        </div>
      )}

      {message && (
        <div
          style={{
            width: "100%",
            marginTop: "8px",
            fontSize: "12px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}