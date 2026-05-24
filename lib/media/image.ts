export function getOptimizedImageUrl(
  url?: string,
  width: number = 1200
): string {
  if (!url || typeof url !== "string") {
    return "/fallback.jpg";
  }

  const cleaned = url.trim();

  if (!cleaned || cleaned === "null" || cleaned === "undefined") {
    return "/fallback.jpg";
  }

  // Fix protocol-relative URLs
  if (cleaned.startsWith("//")) {
    return `https:${cleaned}`;
  }

  // If it's not valid http(s), fallback
  if (!/^https?:\/\//.test(cleaned)) {
    return "/fallback.jpg";
  }

  /**
   * WORDPRESS IMAGE OPTIMIZATION LAYER
   * Works for most WP installs using resize params or CDN plugins
   */
  try {
    const urlObj = new URL(cleaned);

    // Common WP image resizing plugins support this pattern
    urlObj.searchParams.set("w", String(width));
    urlObj.searchParams.set("q", "85"); // quality control

    return urlObj.toString();
  } catch {
    return cleaned;
  }
}