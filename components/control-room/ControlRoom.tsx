"use client";

import useControlRoom from "@/lib/control-room/useControlRoom";
import LiveScoresCore from "@/components/espn/LiveScoresCore";

export default function ControlRoom({ matches }: any) {
  const {
    matches: list,
    activeMatch,
    setActiveMatchId,
  } = useControlRoom(matches);

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
                activeMatch?.id === m.id ? "active" : ""
              }`}
              onClick={() => setActiveMatchId(m.id)}
            >
              <div>{m.home?.name}</div>
              <strong>
                {m.home?.score} - {m.away?.score}
              </strong>
              <div>{m.away?.name}</div>
            </div>
          ))}
        </aside>

        {/* CENTER SCREEN */}
        <main className="center-screen">
          <h3>Main Broadcast Feed</h3>

          {activeMatch ? (
            <LiveScoresCore match={activeMatch} />
          ) : (
            <p>Select a match</p>
          )}
        </main>

        {/* RIGHT PANEL */}
        <aside className="right-panel">
          <h3>AI PANEL</h3>

          {activeMatch && (
            <>
              <div className="stat-box">⚡ Momentum Active</div>
              <div className="stat-box">📊 Win Probability Engine</div>
              <div className="stat-box">🧠 Match Intelligence</div>
            </>
          )}
        </aside>

      </div>
    </div>
  );
}