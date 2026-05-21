"use client";

import {
  useEffect,
  useState,
} from "react";

export default function ReadingProgress() {
  const [width, setWidth] =
    useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.body.scrollHeight -
        window.innerHeight;

      const progress =
        (window.scrollY /
          totalHeight) *
        100;

      setWidth(progress);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <div className="reading-progress">
      <div
        className="reading-bar"
        style={{
          width: `${width}%`,
        }}
      />
    </div>
  );
}