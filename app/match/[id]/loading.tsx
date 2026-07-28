export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl p-6">

      <div className="animate-pulse space-y-6">

        <div className="h-28 rounded-xl bg-gray-200" />

        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-9 space-y-4">

            <div className="h-52 rounded-xl bg-gray-200" />

            <div className="h-52 rounded-xl bg-gray-200" />

            <div className="h-52 rounded-xl bg-gray-200" />

          </div>

          <div className="col-span-3 space-y-4">

            <div className="h-44 rounded-xl bg-gray-200" />

            <div className="h-44 rounded-xl bg-gray-200" />

          </div>

        </div>

      </div>

    </main>
  );
}