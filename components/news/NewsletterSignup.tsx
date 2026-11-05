
"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!consent) {
      setState("error");
      setMessage("Please agree to receive ArsenalTalks emails.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const website = String(formData.get("website") ?? "");

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website }),
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Subscription failed. Please try again."
        );
      }

      setState("success");
      setMessage(
        result?.message || "You're subscribed to ArsenalTalks!"
      );
      setEmail("");
      setName("");
      setConsent(false);
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <section
      className="not-prose my-10 overflow-hidden rounded-md bg-black px-5 py-8 text-center sm:px-10 sm:py-10"
      aria-labelledby="newsletter-heading"
    >
      <h2
        id="newsletter-heading"
        className="text-2xl font-extrabold uppercase tracking-tight text-white"
      >
        Join Our Newsletter
      </h2>

      <p className="mx-auto mt-7 max-w-xl text-sm leading-6 text-white sm:text-base">
        Receive the latest Arsenal news, transfer updates and match reports
        straight to your inbox.
      </p>

      {state === "success" ? (
        <p
          className="mt-6 rounded-md bg-white px-4 py-4 text-sm font-semibold text-green-700"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
            <label htmlFor="newsletter-name" className="sr-only">
              Your name
            </label>

            <input
              id="newsletter-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your Name"
              disabled={state === "submitting"}
              className="h-12 w-full rounded-md border-0 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-red-200"
            />

            <label htmlFor="newsletter-email" className="sr-only">
              Your email
            </label>

            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your Email"
              disabled={state === "submitting"}
              className="h-12 w-full rounded-md border-0 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-red-200"
            />
          </div>

          <label className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 text-xs text-white">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              disabled={state === "submitting"}
              className="h-4 w-4 accent-[#d10000]"
            />
            I agree to receive ArsenalTalks emails
          </label>

          <p className="mt-8 text-sm text-white">
            <a
              href="/privacy-policy/"
              className="underline underline-offset-2 hover:text-red-400"
            >
              Privacy policy
            </a>
          </p>

          {/* Honeypot spam protection */}
          <div
            className="absolute -left-[10000px] h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="newsletter-website">Leave empty</label>
            <input
              id="newsletter-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {state === "error" && (
            <p className="mt-4 text-sm text-red-300" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={state === "submitting" || !email.trim() || !consent}
            className="mt-5 h-11 w-full rounded-md bg-[#d10000] px-5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === "submitting" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}

      <p className="mt-4 text-xs text-gray-400">
        No spam. Unsubscribe whenever you want.
      </p>
    </section>
  );
}
