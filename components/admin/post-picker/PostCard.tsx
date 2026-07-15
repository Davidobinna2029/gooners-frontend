"use client";

import HeroAssignButton from "./HeroAssignButton";

import { StoryCard } from "@/components/admin/story-card";

import type { NewsPost } from "./types";

interface Props {
  post: NewsPost;
}

export default function PostCard({
  post,
}: Props) {
  return (
    <StoryCard
      post={{
        id: post.id,
        title: post.title,
        image: post.image,
        category: post.category,
        author: post.author,
        date: post.date,
      }}
      actions={
        <HeroAssignButton
          postId={post.id}
        />
      }
    />
  );
}