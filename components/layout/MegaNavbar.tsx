"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Transfers", href: "/transfers" },
  { label: "Opinion", href: "/opinion" },
  { label: "Fixtures", href: "/fixtures" },
];

export default function MegaNavbar() {
  const pathname = usePathname();

  return (
    <nav className="mega-navbar">
      <div className="container mega-navbar-inner">
        <Link href="/" className="site-logo">
          ArsenalTalks
        </Link>

        <div className="mega-links">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mega-link ${active ? "active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="mega-actions">
          <button
            type="button"
            className="search-trigger"
            aria-label="Search"
          >
            🔍
          </button>
        </div>
      </div>
    </nav>
  );
}