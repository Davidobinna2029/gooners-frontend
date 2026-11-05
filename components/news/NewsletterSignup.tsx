"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const website = String(formData.get("website") ?? "");

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          consent: true,
          website,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          result?.message || "Subscription failed. Please try again."
        );
      }

      setState("success");
      setMessage(result?.message || "You're subscribed to ArsenalTalks!");
      setEmail("");
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
      className="not-prose relative my-10 w-full overflow-hidden rounded-xl bg-[#171717] px-4 py-6 text-white shadow-lg sm:px-6 sm:py-7"
      aria-labelledby="newsletter-heading"
    >
      <div className="mb-3 inline-flex rounded-full bg-[#3A2020] px-3 py-1">
        <span className="text-[11px] font-bold uppercase tracking-wide text-[#F06A6A]">
          ArsenalTalks Newsletter
        </span>
      </div>

      <h2
        id="newsletter-heading"
        className="text-xl font-extrabold leading-tight tracking-tight text-[#FFFFFF] sm:text-2xl"
      >
        The latest Arsenal news, straight to your inbox.
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#D1D1D1]">
        Get the biggest transfer stories, match reports and breaking Arsenal
        updates delivered directly to you.
      </p>

      {state === "success" ? (
        <div
          className="mt-5 rounded-xl border border-[#285C3C] bg-[#17291E] p-5"
          role="status"
          aria-live="polite"
        >
          <p className="font-semibold text-[#8ED6A5]">
            Subscription update
          </p>
          <p className="mt-2 text-sm leading-6 text-[#D1D1D1]">
            {message}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="relative mt-5 rounded-xl bg-[#292929] p-3 sm:p-4"
        >
          <label
            htmlFor="newsletter-email"
            className="mb-2 block text-sm font-semibold text-[#FFFFFF]"
          >
            Your email address
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
            placeholder="Enter your email address"
            disabled={state === "submitting"}
            className="h-12 w-full rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-4 text-sm text-[#171717] outline-none placeholder:text-[#888888] focus:border-[#D00000] focus:ring-2 focus:ring-[#D00000]/25 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={state === "submitting" || !email.trim()}
            className="mt-2.5 flex h-12 w-full items-center justify-center rounded-lg bg-[#D00000] px-5 text-sm font-bold uppercase text-[#FFFFFF] transition-colors duration-200 hover:bg-[#A80000] focus:outline-none focus:ring-2 focus:ring-[#D00000] focus:ring-offset-2 focus:ring-offset-[#292929] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "submitting" ? "Subscribing..." : "Subscribe Now"}
          </button>

          {/* Honeypot field for spam protection */}
          <div
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="newsletter-website">
              Leave this field empty
            </label>
            <input
              id="newsletter-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {state === "error" && (
            <p className="mt-3 text-sm leading-5 text-[#FF7777]" role="alert">
              {message}
            </p>
          )}
        </form>
      )}

      <p className="mt-4 text-xs leading-5 text-[#BDBDBD]">
        By subscribing, you agree to our{" "}
        <a
          href="/legal/privacy-policy"
          className="font-medium text-[#FFFFFF] underline underline-offset-2 transition-colors hover:text-[#F06A6A]"
        >
          Privacy Policy
        </a>
        . You can unsubscribe at any time.
      </p>
    </section>
  );
}
