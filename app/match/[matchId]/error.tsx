"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  console.error(error);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center space-y-4">

      <h1 className="text-3xl font-bold">
        Unable to load Match Centre
      </h1>

      <p className="text-gray-500">
        Something went wrong while loading the match.
      </p>

      <button
        onClick={reset}
        className="rounded-lg bg-red-600 px-6 py-3 text-white"
      >
        Try Again
      </button>

    </main>
  );
}