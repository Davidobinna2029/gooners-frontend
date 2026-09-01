import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";

export async function PATCH(
req: Request,
{
params,
}: {
params: Promise<{
id: string;
}>;
}
) {
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

const currentUserId = (session.user as { id?: string }).id;
const currentRole = (session.user as { role?: string }).role;

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

const { id } = await params;

const body = await req.json();

const newRole = body?.role;

const allowedRoles = [
"WRITER",
"EDITOR",
"ADMIN",
"OWNER",
];

if (!allowedRoles.includes(newRole)) {
return Response.json(
{
error: "Invalid role",
},
{
status: 400,
}
);
}

const targetUser = await prisma.user.findUnique({
where: {
id,
},
});

if (!targetUser) {
return Response.json(
{
error: "User not found",
},
{
status: 404,
}
);
}

if (targetUser.id === currentUserId) {
return Response.json(
{
error: "You cannot change your own role",
},
{
status: 403,
}
);
}

if (targetUser.role === "OWNER") {
return Response.json(
{
error: "Cannot modify an owner account",
},
{
status: 403,
}
);
}

if (newRole === "OWNER") {
return Response.json(
{
error: "Owner role cannot be assigned through this endpoint",
},
{
status: 403,
}
);
}

const updatedUser = await prisma.user.update({
where: {
id,
},
data: {
role: newRole,
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
action: "USER_ROLE_CHANGED",
metadata: {
targetUserId: id,
email: targetUser.email,
oldRole: targetUser.role,
newRole,
},
},
});

return Response.json(updatedUser);
}

export async function DELETE(
req: Request,
{
params,
}: {
params: Promise<{
id: string;
}>;
}
) {
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

const currentUserId = (session.user as { id?: string }).id;
const currentRole = (session.user as { role?: string }).role;

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

const { id } = await params;

const targetUser = await prisma.user.findUnique({
where: {
id,
},
});

if (!targetUser) {
return Response.json(
{
error: "User not found",
},
{
status: 404,
}
);
}

if (currentUserId === targetUser.id) {
return Response.json(
{
error: "You cannot delete yourself",
},
{
status: 403,
}
);
}

if (targetUser.role === "OWNER") {
return Response.json(
{
error: "Cannot delete an owner account",
},
{
status: 403,
}
);
}

await prisma.auditLog.create({
data: {
userId: currentUserId,
action: "USER_DELETED",
metadata: {
deletedUserId: targetUser.id,
deletedEmail: targetUser.email,
deletedRole: targetUser.role,
},
},
});

await prisma.user.delete({
where: {
id,
},
});

return Response.json({
success: true,
});
}
