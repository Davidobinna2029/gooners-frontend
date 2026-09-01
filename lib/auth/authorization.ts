import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export type UserRole =
| "WRITER"
| "EDITOR"
| "ADMIN"
| "OWNER";

const ROLE_LEVEL: Record<UserRole, number> = {
WRITER: 1,
EDITOR: 2,
ADMIN: 3,
OWNER: 4,
};

export async function getCurrentUser() {
const session = await getServerSession(authOptions);

if (!session?.user) {
return null;
}

const user = session.user as {
id?: string;
email?: string | null;
role?: UserRole;
};

if (!user.id || !user.role) {
return null;
}

return {
id: user.id,
email: user.email ?? null,
role: user.role,
};
}

export async function requireAuth() {
const user = await getCurrentUser();

if (!user) {
throw new Error("UNAUTHORIZED");
}

return user;
}

export async function requireRole(
minimumRole: UserRole
) {
const user = await requireAuth();

if (
ROLE_LEVEL[user.role] <
ROLE_LEVEL[minimumRole]
) {
throw new Error("FORBIDDEN");
}

return user;
}

export async function hasRole(
minimumRole: UserRole
) {
const user = await getCurrentUser();

if (!user) {
return false;
}

return (
ROLE_LEVEL[user.role] >=
ROLE_LEVEL[minimumRole]
);
}
