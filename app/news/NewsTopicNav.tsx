"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const topics = [
  { label: "Latest", href: "/news" },
  { label: "Arsenal", href: "/category/arsenal" },
  { label: "Transfers", href: "/category/transfer-news" },
  { label: "Injuries", href: "/category/injury-news" },
  { label: "Match Reports", href: "/category/match-reports" },
  { label: "Women", href: "/category/women" },
  { label: "Opinion", href: "/opinion" },
];

export default function NewsTopicNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/news") {
      return pathname === "/news";
    }

    if (href === "/opinion") {
      return (
        pathname === "/opinion" ||
        pathname.startsWith("/opinion/")
      );
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <nav
      className="news-topic-nav"
      aria-label="News categories"
    >
      {topics.map((topic) => {
        const active = isActive(topic.href);

        return (
          <Link
            key={topic.href}
            href={topic.href}
            className={active ? "news-topic-active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {topic.label}
          </Link>
        );
      })}
    </nav>
  );
}