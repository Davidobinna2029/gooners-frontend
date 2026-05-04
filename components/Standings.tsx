"use client";

import { useEffect, useState } from "react";

export default function Standings() {
  const [table, setTable] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/football")
      .then((res) => res.json())
      .then((data) => {
        setTable(data.standings?.standings?.[0]?.table || []);
      });
  }, []);

  return (
    <div className="panel">
      <h2>Premier League</h2>

      {table.map((team: any) => (
        <div key={team.team.id}>
          {team.position}. {team.team.name} ({team.points})
        </div>
      ))}
    </div>
  );
}