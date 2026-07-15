import { prisma } from "@/lib/db/prisma";

export async function GET() {
try {
const logs = await prisma.auditLog.findMany({
orderBy: {
createdAt: "desc",
},
take: 100,
include: {
user: true,
},
});

return Response.json(logs);

} catch (error) {
return Response.json(
{
error: "Failed to fetch audit logs",
details: String(error),
},
{
status: 500,
}
);
}
}