"use client";

import Link from "next/link";
import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

interface Props {
  posts: NormalizedPost[];
}

export default function BreakingTicker({ posts }: Props) {
  if (!posts?.length) return null;

  const breaking = posts.slice(0, 8);

  return (
    <section className="breaking-ticker">
      <div className="container">
        <div className="ticker-inner">

          {/* LABEL */}
          <span className="ticker-label">BREAKING</span>

          {/* SWIPER AREA */}
          <div className="ticker-swiper">
            <Swiper
              modules={[Autoplay]}
              direction="horizontal"
              loop
              speed={600}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              slidesPerView={1}
            >
              {breaking.map((post) => (
                <SwiperSlide key={post.id}>
                  <Link
                    href={`/news/${post.slug}`}
                    className="ticker-item"
                  >
                    <span className="ticker-text">
                      {post.title}
                    </span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>
      </div>
    </section>
  );
}