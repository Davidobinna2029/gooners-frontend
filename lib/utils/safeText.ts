// lib/utils/safeText.ts

export function safeText(value: any): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    return (
      value.rendered ||
      value.title ||
      value.name ||
      ""
    );
  }

  return "";
}