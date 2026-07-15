export type OverrideType =
| "PIN_TO_HERO"
| "FORCE_BREAKING"
| "BOOST_SCORE"
| "BLOCK_POST"
| "HIDE_POST";

export async function getOverrides() {
const res = await fetch("/api/overrides");

if (!res.ok) {
throw new Error("Failed to load overrides");
}

return res.json();
}

export async function createOverride(data: {
postId: number;
type: OverrideType;
value?: number;
reason?: string;
}) {
const res = await fetch("/api/overrides", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
});

if (!res.ok) {
throw new Error("Failed to create override");
}

return res.json();
}

export async function deleteOverride(id: string) {
const res = await fetch("/api/overrides/${id}", {
method: "DELETE",
});

if (!res.ok) {
throw new Error("Failed to delete override");
}

return res.json();
}