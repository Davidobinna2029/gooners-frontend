const BASE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

export async function fetchWordPress(
  endpoint: string
) {
  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        `WordPress Error: ${res.status}`
      );
    }

    return res.json();
  } catch (error) {
    console.error(
      "WordPress Client Error:",
      error
    );

    return null;
  }
}