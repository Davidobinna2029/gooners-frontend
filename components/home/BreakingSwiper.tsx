"use client";

import Link from "next/link";
import type { CanonicalPost } from "@/types/content";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

interface Props {
  posts: CanonicalPost[];
}

export default function BreakingSwiper({ posts }: Props) {
  if (!posts?.length) return null;

  return (
    <section className="breaking-wrapper">
      <div className="container breaking-inner">

        <span className="breaking-badge">Breaking</span>

        <div className="breaking-swiper">
          <Swiper
            modules={[Autoplay]}
            loop
            speed={700}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
          >
            {posts.slice(0, 6).map((post) => (
              <SwiperSlide key={post.id}>
                <div className="breaking-slide">
                  <Link href={`/news/${post.slug}`}>
                    {post.title}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}