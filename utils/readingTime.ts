export function readingTime(
  text: string
) {
  const words =
    text.split(" ").length;

  const time = Math.ceil(
    words / 200
  );

  return `${time} min read`;
}