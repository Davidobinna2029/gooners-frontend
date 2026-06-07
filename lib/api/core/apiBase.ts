export const API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!API_BASE) {
  throw new Error("Missing NEXT_PUBLIC_WORDPRESS_API_URL");
}