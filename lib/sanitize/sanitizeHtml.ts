/**
 * SAFE HTML SANITIZER (no dependencies)
 * Removes script tags + dangerous inline JS
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  return html
    // remove script/style tags completely
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")

    // remove onEvent handlers (onclick, onerror, etc.)
    .replace(/\son\w+="[^"]*"/gi, "")

    // remove javascript: links
    .replace(/javascript:/gi, "")

    .trim();
}