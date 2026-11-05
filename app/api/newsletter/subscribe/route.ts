
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
      console.error("[NEWSLETTER] Mailchimp configuration is missing.");

      return jsonMessage(
        "Newsletter subscriptions are temporarily unavailable.",
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

    const existingResponse = await fetch(memberUrl, {
      method: "GET",
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    let requestBody: Record<string, unknown>;

    if (existingResponse.status === 404) {
      requestBody = {
        email_address: email,
        status_if_new: "subscribed",
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

      if (existing.status === "cleaned") {
        return jsonMessage(
          "This email address cannot currently be subscribed. Please use another address.",
          409
        );
      }

      if (existing.status === "unsubscribed" ||
          existing.status === "archived") {
        return jsonMessage(
          "This email address is not currently eligible for subscription. Please contact us for help.",
          409
        );
      }

      if (existing.status === "pending") {
        requestBody = {
          email_address: email,
          status: "subscribed",
        };
      } else {
        return jsonMessage(
          "We couldn't verify this email address. Please try again later.",
          409
        );
      }
    } else {
      console.error("[NEWSLETTER] Mailchimp lookup failed:", {
        status: existingResponse.status,
      });

      return jsonMessage(
        "We couldn't verify your email right now. Please try again.",
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
      const details = await subscribeResponse.text();

      console.error("[NEWSLETTER] Mailchimp rejected subscription:", {
        status: subscribeResponse.status,
        details: details.slice(0, 1000),
      });

      return jsonMessage(
        "We couldn't process your subscription. Please try again.",
        502
      );
    }

    const member = (await subscribeResponse.json()) as {
      status?: string;
    };

    console.log("[NEWSLETTER] Mailchimp subscription result:", {
      status: member.status,
    });

    if (member.status === "subscribed") {
      return jsonMessage(
        "You're subscribed to ArsenalTalks! Thanks for joining us."
      );
    }

    return jsonMessage(
      "Your subscription status could not be confirmed. Please try again.",
      502
    );
  } catch (error) {
    console.error("[NEWSLETTER] Subscription request failed:", {
      error: error instanceof Error ? error.message : String(error),
    });

    return jsonMessage(
      "Something went wrong. Please try again later.",
      500
    );
  }
}
