"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Fixtures", href: "/fixtures" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <header className="site-header">

      {/* HEADER BAR */}
      <div className="header-inner">

        {/* BRAND */}
        <Link
          href="/"
          className="logo"
          aria-label="ArsenalTalks"
        >
          ArsenalTalks
        </Link>

        {/* MENU BUTTON */}
        <button
          type="button"
          className={`menu-btn ${open ? "open" : ""}`}
          onClick={() => setOpen((value) => !value)}
          aria-label={
            open
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span className="menu-icon">
            <span />
            <span />
            <span />
          </span>
        </button>

      </div>

      {/* MENU */}
      <div
        id="mobile-navigation"
        className={`mobile-menu ${open ? "open" : ""}`}
      >
        <nav
          className="mobile-nav"
          aria-label="Main navigation"
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-link ${
                  active ? "active" : ""
                }`}
                aria-current={
                  active ? "page" : undefined
                }
              >
                <span>{link.label}</span>

                <span
                  className="mobile-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BACKDROP */}
      {open && (
        <button
          type="button"
          className="menu-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}

    </header>
  );
}