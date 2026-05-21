"use client";

export default function Footer() {
  return (
    <footer style={{ padding: "1rem", textAlign: "center", background: "#f5f5f5" }}>
      <p>© {new Date().getFullYear()} ArsenalTalks. All rights reserved.</p>
    </footer>
  );
}