import NewsCard from "@/components/news/NewsCard";

export default function FeaturedGrid({
  posts,
}: any) {
  if (!posts?.length)
    return null;

  return (
    <section className="featured-grid">
      {posts.map((post: any) => (
        <NewsCard
          key={post.id}
          post={post}
        />
      ))}
    </section>
  );
}