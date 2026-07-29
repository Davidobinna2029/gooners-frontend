export function formatAttendance(
  attendance?: number
) {

  if (!attendance) {

    return "Unknown";

  }

  return attendance.toLocaleString();

}

export function formatKickoff(
  kickoff: string
) {

  return new Date(kickoff)
    .toLocaleString();

}