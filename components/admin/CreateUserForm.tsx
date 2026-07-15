"use client";

import { useState } from "react";

export default function CreateUserForm() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("WRITER");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            role,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to create user"
        );
      }

      setMessage(
        "User created successfully."
      );

      setEmail("");
      setPassword("");
      setRole("WRITER");

      location.reload();
    } catch {
      setMessage(
        "Failed to create user."
      );
    }

    setLoading(false);
  }

  return (
    <div className="admin-card">
      <h2>Create User</h2>

      <form
        onSubmit={handleSubmit}
        className="create-user-form"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
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
        </select>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create User"}
        </button>

        {message && (
          <p>{message}</p>
        )}
      </form>
    </div>
  );
}