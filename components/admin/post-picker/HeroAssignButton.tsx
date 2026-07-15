"use client";

import { useState } from "react";

interface Props {
  postId: number;
}

export default function HeroAssignButton({
  postId,
}: Props) {
  const [slot, setSlot] =
    useState("1");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function assign() {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        "/api/overrides",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            postId,

            type: "HERO_POSITION",

            value: Number(slot),

            createdBy: "admin",

            reason: `Hero slot ${slot}`,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to assign hero."
        );
      }

      setMessage(
        `✓ Assigned to Hero #${slot}`
      );

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to assign hero."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero-actions">
      <select
        value={slot}
        disabled={loading}
        onChange={(e) =>
          setSlot(e.target.value)
        }
      >
        <option value="1">
          Hero #1
        </option>

        <option value="2">
          Hero #2
        </option>

        <option value="3">
          Hero #3
        </option>

        <option value="4">
          Hero #4
        </option>
      </select>

      <button
        onClick={assign}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Assign Hero"}
      </button>

      {message && (
        <div
          className="hero-status"
          style={{
            marginTop: 8,
            fontSize: 13,
            fontWeight: 600,
            color: message.startsWith("✓")
              ? "#16a34a"
              : "#dc2626",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}