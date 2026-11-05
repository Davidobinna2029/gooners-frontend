
import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonMessage(message: string, status = 200) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: unknown;
      consent?: unknown;
      website?: unknown;
    };

    // Silently ignore honeypot submissions.
    if (typeof body.website === "string" && body.website.trim()) {
      return jsonMessage("Thanks for your interest.");
    }

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return jsonMessage("Enter a valid email address.", 400);
    }

    if (body.consent !== true) {
      return jsonMessage(
        "Please confirm your email subscription.",
        400
      );
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

    if (
      !apiKey ||
      !audienceId ||
      !serverPrefix ||
      !/^[a-z]{2}\d+$/.test(serverPrefix)
    ) {
      console.error(
        "[NEWSLETTER] Mailchimp environment variables are missing or invalid."
      );

      return jsonMessage(
        "Newsletter subscriptions are temporarily unavailable. Please try again later.",
        503
      );
    }

    const subscriberHash = createHash("md5")
      .update(email)
      .digest("hex");

    const memberUrl =
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/` +
      `${encodeURIComponent(audienceId)}/members/${subscriberHash}`;

    const headers = {
      Authorization:
        "Basic " +
        Buffer.from(`anystring:${apiKey}`).toString("base64"),
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Check whether this address already exists.
    const existingResponse = await fetch(memberUrl, {
      method: "GET",
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    let requestBody: Record<string, unknown>;

    if (existingResponse.status === 404) {
      // New contacts must confirm their subscription.
      requestBody = {
        email_address: email,
        status_if_new: "pending",
      };
    } else if (existingResponse.ok) {
      const existing = (await existingResponse.json()) as {
        status?: string;
      };

      if (existing.status === "subscribed") {
        return jsonMessage(
          "This email address is already subscribed to ArsenalTalks."
        );
      }

      if (existing.status === "pending") {
        return jsonMessage(
          "Your subscription is awaiting confirmation. Please check your inbox."
        );
      }

      if (existing.status === "cleaned") {
        return jsonMessage(
          "This email address cannot currently be subscribed. Please try another address.",
          409
        );
      }

      // A previously unsubscribed contact has submitted fresh consent.
      requestBody = {
        email_address: email,
        status: "pending",
      };
    } else {
      console.error(
        "[NEWSLETTER] Mailchimp contact lookup failed.",
        { status: existingResponse.status }
      );

      return jsonMessage(
        "We couldn't verify your email right now. Please try again shortly.",
        502
      );
    }

    const subscribeResponse = await fetch(memberUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(requestBody),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!subscribeResponse.ok) {
      console.error(
        "[NEWSLETTER] Mailchimp rejected a subscription.",
        { status: subscribeResponse.status }
      );

      return jsonMessage(
        "We couldn't process your subscription. Please try again shortly.",
        502
      );
    }

    const member = (await subscribeResponse.json()) as {
      status?: string;
    };

    if (member.status === "pending") {
      return jsonMessage(
        "Check your inbox for the ArsenalTalks confirmation email. Click the confirmation link to complete your subscription."
      );
    }

    if (member.status === "subscribed") {
      return jsonMessage(
        "Your email is already subscribed to ArsenalTalks."
      );
    }

    return jsonMessage(
      "Your request was received, but your subscription status needs checking. Please contact us if you need help.",
      502
    );
  } catch (error) {
    console.error("[NEWSLETTER] Subscription request failed.", {
      error:
        error instanceof Error ? error.message : String(error),
    });

    return jsonMessage(
      "Something went wrong. Please try again later.",
      500
    );
  }
}
