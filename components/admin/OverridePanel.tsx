"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  createOverride,
  deleteOverride,
  getOverrides,
  type OverrideType,
} from "@/lib/admin/overrides";

import { useNewsroomEvents } from "@/hooks/useNewsroomEvents";

export default function OverridePanel() {
  const [postId, setPostId] =
    useState("");

  const [type, setType] =
    useState<OverrideType>(
      "PIN_TO_HERO"
    );

  const [overrides, setOverrides] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const loadOverrides =
    useCallback(async () => {
      try {
        const data =
          await getOverrides();

        setOverrides(
          Array.isArray(data)
            ? data
            : []
        );

        setLastUpdated(
          new Date()
        );
      } catch (error) {
        console.error(
          "Failed to load overrides",
          error
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadOverrides();
  }, [loadOverrides]);

  /**
   * LIVE SSE REFRESH
   */
  useNewsroomEvents(() => {
    loadOverrides();
  });

  async function handleCreate() {
    if (!postId || saving) return;

    try {
      setSaving(true);

      await createOverride({
        postId:
          Number(postId),
        type,
      });

      setPostId("");

      await loadOverrides();
    } catch (error) {
      console.error(
        "Create override failed",
        error
      );

      alert(
        "Failed to create override"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    id: string
  ) {
    try {
      await deleteOverride(id);

      await loadOverrides();
    } catch (error) {
      console.error(
        "Delete override failed",
        error
      );

      alert(
        "Failed to delete override"
      );
    }
  }

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: 16,
        }}
      >
        <h2>
          Editorial Overrides
        </h2>

        {lastUpdated && (
          <small>
            Updated:{" "}
            {lastUpdated.toLocaleTimeString()}
          </small>
        )}
      </div>

      <div className="override-form">
        <input
          type="number"
          placeholder="Post ID"
          value={postId}
          onChange={(e) =>
            setPostId(
              e.target.value
            )
          }
        />

        <select
          value={type}
          onChange={(e) =>
            setType(
              e.target
                .value as OverrideType
            )
          }
        >
          <option value="PIN_TO_HERO">
            Pin To Hero
          </option>

          <option value="HERO_POSITION">
            Hero Position
          </option>

          <option value="FORCE_BREAKING">
            Force Breaking
          </option>

          <option value="BOOST_SCORE">
            Boost Score
          </option>

          <option value="BLOCK_POST">
            Block Post
          </option>

          <option value="HIDE_POST">
            Hide Post
          </option>
        </select>

        <button
          onClick={handleCreate}
          disabled={
            !postId || saving
          }
        >
          {saving
            ? "Creating..."
            : "Create Override"}
        </button>
      </div>

      <div
        className="override-list"
        style={{
          marginTop: 20,
        }}
      >
        {loading ? (
          <p>
            Loading overrides...
          </p>
        ) : overrides.length ===
          0 ? (
          <p>
            No overrides found.
          </p>
        ) : (
          overrides.map(
            (override) => (
              <div
                key={
                  override.id
                }
                className="override-item"
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: 12,
                  padding:
                    "10px 0",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                <div>
                  <strong>
                    #
                    {
                      override.postId
                    }
                  </strong>

                  <div>
                    {
                      override.type
                    }
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleDelete(
                      override.id
                    )
                  }
                >
                  Remove
                </button>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}