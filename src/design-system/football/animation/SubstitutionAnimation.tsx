"use client";

export default function SubstitutionAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="
          rounded-full
          bg-black/75
          px-6
          py-4
          text-5xl
          text-white
          animate-spin
        "
      >
        🔄
      </div>
    </div>
  );
}