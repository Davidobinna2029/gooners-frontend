export const metadata = {
  title: "Subscription Confirmed | ArsenalTalks",
  description: "Your ArsenalTalks newsletter subscription has been confirmed.",
};

export default function NewsletterConfirmedPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-5 py-16">
      <section className="w-full rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-2xl font-bold text-green-700" aria-hidden="true">
          ✓
        </div>
        <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#d10000]">
          ArsenalTalks Newsletter
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-950">
          You're on the list.
        </h1>
        <p className="mt-3 text-base leading-7 text-gray-600">
          Your email address has been confirmed. You'll receive ArsenalTalks newsletter updates in your inbox.
        </p>
        <a
          href="/"
          className="mt-7 inline-flex rounded-lg bg-[#d10000] px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
        >
          Back to ArsenalTalks
        </a>
      </section>
    </main>
  );
}
