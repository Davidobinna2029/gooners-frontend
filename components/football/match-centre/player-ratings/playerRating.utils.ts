export function ratingColor(
  rating: number
) {

  if (rating >= 8.5)
    return "bg-green-600 text-white";

  if (rating >= 7)
    return "bg-green-100 text-green-700";

  if (rating >= 6)
    return "bg-yellow-100 text-yellow-700";

  return "bg-red-100 text-red-700";

}

export function ratingLabel(
  rating: number
) {

  if (rating >= 9)
    return "World Class";

  if (rating >= 8)
    return "Excellent";

  if (rating >= 7)
    return "Good";

  if (rating >= 6)
    return "Average";

  return "Poor";

}