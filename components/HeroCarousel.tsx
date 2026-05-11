"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  posts: any[];
}

export default function HeroCarousel({
  posts,
}: Props) {
  return (
    <section className="hero-carousel">
      <Swiper
        modules={[
          Navigation,
          Pagination,
          Autoplay,
        ]}
        navigation
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
        }}
        loop
      >
        {posts.map(
          (post) => (
            <SwiperSlide
              key={post.id}
            >
              <Link
                href={`/news/${post.slug}`}
                className="hero-slide"
              >
                <div className="hero-image-wrapper">
                  <Image
                    src={
                      post.featuredImage
                    }
                    alt={
                      post.title
                        .rendered
                    }
                    fill
                    unoptimized
                    className="hero-image"
                    priority
                  />
                </div>

                <div className="hero-slide-overlay">
                  <span className="breaking-tag">
                    BREAKING
                  </span>

                  <h1
                    dangerouslySetInnerHTML={{
                      __html:
                        post.title
                          .rendered,
                    }}
                  />

                  <p>
                    {post.excerpt.rendered.slice(
                      0,
                      150
                    )}
                    ...
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </section>
  );
}