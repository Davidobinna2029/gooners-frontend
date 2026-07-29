export function trendColor(
  trend?: "up" | "down" | "neutral"
) {

  switch (trend) {

    case "up":
      return "text-green-600";

    case "down":
      return "text-red-600";

    default:
      return "text-gray-600";

  }

}