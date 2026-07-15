export interface HomepageLayoutPayload {
  id?: string;

  name?: string;

  layout: unknown;

  createdBy?: string;
}

/**
 * Load latest homepage layout
 */
export async function loadHomepageLayout() {
  const response = await fetch("/api/homepage-layout", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load homepage layout.");
  }

  return response.json();
}

/**
 * Save homepage draft
 */
export async function saveHomepageLayout(
  payload: HomepageLayoutPayload
) {
  const response = await fetch("/api/homepage-layout", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save homepage layout.");
  }

  return response.json();
}

/**
 * Publish homepage
 */
export async function publishHomepageLayout(
  id: string
) {
  const response = await fetch("/api/homepage-layout", {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to publish homepage.");
  }

  return response.json();
}