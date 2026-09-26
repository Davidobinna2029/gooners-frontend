import { decode } from "html-entities";

export function decodeHtml(value: string | null | undefined): string {
  if (!value) return "";

  return decode(value, {
    scope: "strict",
  });
}