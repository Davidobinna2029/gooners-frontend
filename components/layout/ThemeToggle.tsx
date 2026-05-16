"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme) {
      document.body.setAttribute(
        "data-theme",
        savedTheme
      );
    }
  }, []);

  function toggleTheme() {
    const current =
      document.body.getAttribute(
        "data-theme"
      );

    const next =
      current === "light"
        ? "dark"
        : "light";

    document.body.setAttribute(
      "data-theme",
      next
    );

    localStorage.setItem(
      "theme",
      next
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
    >
      Theme
    </button>
  );
}