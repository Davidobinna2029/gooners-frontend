"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

import Link from "next/link";

type Props = {
  posts: {
    id: number;
    title: string;
    slug: string;
  }[];
};

export default function BreakingSwiper({ posts }: Props) {
  if (!posts?.length) return null;

  return (
    <div className="breaking-wrapper">
      <div className="container breaking-inner">

        {/* BADGE */}
        <div className="breaking-badge">
          Breaking
        </div>

        {/* SWIPER */}
        <div className="breaking-swiper">
          <Swiper
            modules={[Autoplay, EffectFade]}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop
            speed={800}
            effect="fade"
          >
            {posts.map((post) => (
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
    </div>
  );
}