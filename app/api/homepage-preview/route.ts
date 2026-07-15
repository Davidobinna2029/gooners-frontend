import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

export async function GET() {
try {
const feed = await buildHomepageFeed();

return Response.json(feed);

} catch (error) {
return Response.json(
{
error: "Failed to build homepage preview",
details: String(error),
},
{ status: 500 }
);
}
}