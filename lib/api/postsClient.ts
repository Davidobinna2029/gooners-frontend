import { wpFetch } from "./core/wpFetch";
import { buildPostsQuery, PostsQuery } from "./postsQuery";

export async function fetchPosts(q: PostsQuery, revalidate = 60) {
  return wpFetch<any[]>(buildPostsQuery(q), {
    revalidate,
  });
}