export default async function TestPage() {
  const res = await fetch("http://localhost:3000/api/workflows", {
    cache: "no-store",
  });

  const data = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}