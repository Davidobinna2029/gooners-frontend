import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center space-y-4">

      <h1 className="text-4xl font-bold">
        Match Not Found
      </h1>

      <p className="text-gray-500">
        We couldn't find this fixture.
      </p>

      <Link
        href="/fixtures"
        className="rounded-lg bg-red-600 px-6 py-3 text-white"
      >
        Browse Fixtures
      </Link>

    </main>
  );
}