import { wpFetch } from "./core/wpFetch";

export async function searchPosts(
  query: string,
  perPage = 12
) {
  return wpFetch<any[]>(
    `/posts?search=${encodeURIComponent(
      query
    )}&_embed=1&per_page=${perPage}`,
    {
      revalidate: 60,
    }
  );
}