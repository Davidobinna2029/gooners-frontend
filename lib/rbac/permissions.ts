import type { Role } from "./types";

export const PERMISSIONS: Record<Role, string[]> = {
  WRITER: [
    "create_post",
    "edit_own",
  ],

  EDITOR: [
    "create_post",
    "edit_any",
    "publish",
  ],

  ADMIN: [
    "create_post",
    "edit_any",
    "publish",
    "override",
    "audit_view",
  ],

  OWNER: ["*"],
};