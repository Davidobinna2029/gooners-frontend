// lib/permissions.ts

export function isOwner(
  role?: string
) {
  return role === "OWNER";
}

export function isAdmin(
  role?: string
) {
  return (
    role === "ADMIN" ||
    role === "OWNER"
  );
}

export function isEditor(
  role?: string
) {
  return (
    role === "EDITOR" ||
    role === "ADMIN" ||
    role === "OWNER"
  );
}

export function isWriter(
  role?: string
) {
  return (
    role === "WRITER" ||
    role === "EDITOR" ||
    role === "ADMIN" ||
    role === "OWNER"
  );
}

export function canApproveWorkflow(
  role?: string
) {
  return isEditor(role);
}

export function canManageHomepage(
  role?: string
) {
  return isAdmin(role);
}

export function canManageOverrides(
  role?: string
) {
  return isAdmin(role);
}

export function canManageUsers(
  role?: string
) {
  return isOwner(role);
}