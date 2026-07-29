export default function TimelineFilters() {
  return (
    <div className="mb-6 flex flex-wrap gap-2">

      <button className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white">
        All
      </button>

      <button className="rounded-full border px-4 py-2 text-sm">
        Goals
      </button>

      <button className="rounded-full border px-4 py-2 text-sm">
        Cards
      </button>

      <button className="rounded-full border px-4 py-2 text-sm">
        VAR
      </button>

      <button className="rounded-full border px-4 py-2 text-sm">
        Subs
      </button>

    </div>
  );
}