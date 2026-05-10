"use client";

import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";

import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface Props {
  posts?: any[];
}

export default function HeroCarousel({
  posts = [],
}: Props) {
  if (!posts.length) return null;

  return (
    <section className="hero-carousel">
      <Swiper
        modules={[
          Autoplay,
          Pagination,
        ]}
        autoplay={{
          delay: 5000,
        }}
        pagination={{
          clickable: true,
        }}
        loop
      >
        {posts.map((post: any) => {
          const image =
            post?._embedded?.[
              "wp:featuredmedia"
            ]?.[0]?.source_url ||
            "/fallback.jpg";

          return (
            <SwiperSlide
              key={post.id}
            >
              <Link
                href={`/news/${post.slug}`}
                className="hero-slide"
              >
                <Image
                  src={image}
                  alt={
                    post.title.rendered
                  }
                  fill
                  priority
                  className="hero-slide-image"
                />

                <div className="hero-slide-overlay">
                  <div className="container">
                    <div className="hero-slide-content">
                      <span>
                        Arsenal News
                      </span>

                      <h1
                        dangerouslySetInnerHTML={{
                          __html:
                            post.title
                              .rendered,
                        }}
                      />

                      <p
                        dangerouslySetInnerHTML={{
                          __html:
                            post.excerpt
                              .rendered.replace(
                                /<[^>]+>/g,
                                ""
                              ),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}