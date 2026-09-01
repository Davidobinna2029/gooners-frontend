"use client";

import { useState } from "react";

export default function CreateUserForm() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [role, setRole] = useState("WRITER");

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

async function handleSubmit(
e: React.FormEvent<HTMLFormElement>
) {
e.preventDefault();

if (loading) {
  return;
}

setLoading(true);
setMessage("");
setError("");

const normalizedEmail = email.trim().toLowerCase();

try {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: normalizedEmail,
      password,
      role,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.error || "Failed to create user."
    );
  }

  setMessage("User created successfully.");

  setEmail("");
  setPassword("");
  setRole("WRITER");

  window.location.reload();
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Failed to create user."
  );
} finally {
  setLoading(false);
}

}

return ( <div className="admin-card"> <div className="admin-card-header"> <div> <h2>Create User</h2>


      <p>
        Create a newsroom account and assign its
        editorial role.
      </p>
    </div>
  </div>

  <form
    onSubmit={handleSubmit}
    className="create-user-form"
  >
    <input
      type="email"
      placeholder="Email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      autoComplete="email"
      required
      disabled={loading}
    />

    <input
      type="password"
      placeholder="Temporary password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      autoComplete="new-password"
      minLength={8}
      required
      disabled={loading}
    />

    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      disabled={loading}
    >
      <option value="WRITER">WRITER</option>
      <option value="EDITOR">EDITOR</option>
      <option value="ADMIN">ADMIN</option>
    </select>

    <button
      type="submit"
      disabled={loading}
    >
      {loading ? "Creating..." : "Create User"}
    </button>

    {message && (
      <p
        role="status"
        style={{
          marginTop: "10px",
        }}
      >
        {message}
      </p>
    )}

    {error && (
      <p
        role="alert"
        style={{
          marginTop: "10px",
        }}
      >
        {error}
      </p>
    )}
  </form>
</div>

);
}
