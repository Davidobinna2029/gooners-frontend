const BASE =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  "https://api.arsenaltalks.com";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const res = await fetch(
      `${BASE}/wp-json/wp/v2/posts?slug=${params.slug}&_embed`,
      { next: { revalidate: 60 } }
    );

    const data = await res.json();

    return Response.json(data[0] || null);
  } catch {
    return Response.json(null);
  }
}