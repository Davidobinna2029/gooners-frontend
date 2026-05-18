export function sanitize(
  html: string
) {
  return html.replace(
    /<[^>]*>?/gm,
    ""
  );
}