export type Role = "WRITER" | "EDITOR" | "ADMIN" | "OWNER";

export interface User {
  id: string;
  role: Role;
}