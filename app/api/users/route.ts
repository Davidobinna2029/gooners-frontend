import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";

const ALLOWED_CREATE_ROLES = [
"WRITER",
"EDITOR",
"ADMIN",
] as const;

export async function GET() {
const session = await getServerSession(authOptions);

if (!session?.user) {
return Response.json(
{
error: "Unauthorized",
},
{
status: 401,
}
);
}

const role = (session.user as { role?: string }).role;

if (!canManageUsers(role)) {
return Response.json(
{
error: "Forbidden",
},
{
status: 403,
}
);
}

const users = await prisma.user.findMany({
orderBy: {
createdAt: "desc",
},
select: {
id: true,
email: true,
role: true,
createdAt: true,
},
});

return Response.json(users);
}

export async function POST(req: Request) {
const session = await getServerSession(authOptions);

if (!session?.user) {
return Response.json(
{
error: "Unauthorized",
},
{
status: 401,
}
);
}

const currentUserId = (
session.user as {
id?: string;
}
).id;

const currentRole = (
session.user as {
role?: string;
}
).role;

if (!currentUserId || !canManageUsers(currentRole)) {
return Response.json(
{
error: "Forbidden",
},
{
status: 403,
}
);
}

let body: {
email?: string;
password?: string;
role?: string;
};

try {
body = await req.json();
} catch {
return Response.json(
{
error: "Invalid JSON request body",
},
{
status: 400,
}
);
}

const email = body.email?.trim().toLowerCase();
const password = body.password;
const newRole = body.role;

if (!email || !password || !newRole) {
return Response.json(
{
error: "Email, password and role are required",
},
{
status: 400,
}
);
}

if (!email.includes("@")) {
return Response.json(
{
error: "Invalid email address",
},
{
status: 400,
}
);
}

if (password.length < 8) {
return Response.json(
{
error: "Password must be at least 8 characters",
},
{
status: 400,
}
);
}

if (
!ALLOWED_CREATE_ROLES.includes(
newRole as (typeof ALLOWED_CREATE_ROLES)[number]
)
) {
return Response.json(
{
error:
"Invalid role. OWNER accounts cannot be created through this endpoint.",
},
{
status: 400,
}
);
}

const existingUser = await prisma.user.findUnique({
where: {
email,
},
});

if (existingUser) {
return Response.json(
{
error: "User already exists",
},
{
status: 409,
}
);
}

const hashedPassword = await bcrypt.hash(password, 12);

const user = await prisma.user.create({
data: {
email,
password: hashedPassword,
role: newRole as "WRITER" | "EDITOR" | "ADMIN",
},
select: {
id: true,
email: true,
role: true,
createdAt: true,
},
});

await prisma.auditLog.create({
data: {
userId: currentUserId,
action: "USER_CREATED",
metadata: {
createdUser: user.email,
role: user.role,
},
},
});

return Response.json(
user,
{
status: 201,
}
);
}
