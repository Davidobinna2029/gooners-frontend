import { PERMISSIONS } from "./permissions";
import type { Role } from "./types";

export function hasPermission(
  role: Role,
  action: string
): boolean {
  const permissions =
    PERMISSIONS[role];

  if (!permissions) {
    return false;
  }

  if (
    permissions.includes("*")
  ) {
    return true;
  }

  return permissions.includes(
    action
  );
}