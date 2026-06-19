const rawBase = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!rawBase) {
  throw new Error("Missing NEXT_PUBLIC_WORDPRESS_API_URL");
}

export const API_BASE = rawBase.replace(/\/$/, "");