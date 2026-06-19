import { API_BASE } from "./apiBase";

interface WPFetchOptions extends RequestInit {
  revalidate?: number;
}

export async function wpFetch<T>(
  endpoint: string,
  {
    revalidate = 60,
    ...options
  }: WPFetchOptions = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    next: {
      revalidate,
    },
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("[WP API ERROR]", {
      url,
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });

    throw new Error(
      `WordPress API request failed (${response.status})`
    );
  }

  return response.json();
}