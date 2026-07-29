export function getSeverityColor(
  severity: "low" | "medium" | "high"
) {
  switch (severity) {
    case "high":
      return "border-red-500 bg-red-50";

    case "medium":
      return "border-yellow-500 bg-yellow-50";

    default:
      return "border-green-500 bg-green-50";
  }
}