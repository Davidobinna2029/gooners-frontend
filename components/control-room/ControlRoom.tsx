"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useControlRoom from "@/lib/control-room/useControlRoom";
import LiveScoresCore from "@/components/espn/LiveScoresCore";

export default function ControlRoom({
  matches,
}: any) {
  const router = useRouter();

  const {
    matches: list,
    activeMatch,
    setActiveMatchId,
  } = useControlRoom(matches);

  useEffect(() => {
    const events =
      new EventSource(
        "/api/events/stream"
      );

    const refresh = () => {
      console.log(
        "Newsroom updated. Refreshing..."
      );

      router.refresh();
    };

    events.addEventListener(
      "workflow",
      refresh
    );

    events.addEventListener(
      "override",
      refresh
    );

    events.addEventListener(
      "hero",
      refresh
    );

    events.addEventListener(
      "breaking",
      refresh
    );

    events.addEventListener(
      "audit",
      refresh
    );

    events.onerror = () => {
      console.warn(
        "Lost newsroom connection."
      );
    };

    return () => {
      events.close();
    };
  }, [router]);

  return (
    <div className="control-room">
      {/* TOP BAR */}
      <div className="top-bar">
        ⚽ ESPN CONTROL ROOM ACTIVE
      </div>

      <div className="layout">
        {/* LEFT PANEL */}
        <aside className="left-panel">
          <h3>Live Matches</h3>

          {list.map((m: any) => (
            <div
              key={m.id}
              className={`match-item ${
                activeMatch?.id ===
                m.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveMatchId(
                  m.id
                )
              }
            >
              <div>
                {m.home?.name}
              </div>

              <strong>
                {m.home?.score} -{" "}
                {m.away?.score}
              </strong>

              <div>
                {m.away?.name}
              </div>
            </div>
          ))}
        </aside>

        {/* CENTER */}
        <main className="center-screen">
          <h3>
            Main Broadcast Feed
          </h3>

          {activeMatch ? (
            <LiveScoresCore
              match={activeMatch}
            />
          ) : (
            <p>
              Select a match
            </p>
          )}
        </main>

        {/* RIGHT */}
        <aside className="right-panel">
          <h3>AI PANEL</h3>

          {activeMatch && (
            <>
              <div className="stat-box">
                ⚡ Momentum Active
              </div>

              <div className="stat-box">
                📊 Win Probability
                Engine
              </div>

              <div className="stat-box">
                🧠 Match
                Intelligence
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}