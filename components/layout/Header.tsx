"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type NavigationLink = {
label: string;
href: string;
external?: boolean;
};

const primaryLinks: NavigationLink[] = [
{ label: "Home", href: "/" },
];

const categoryLinks: NavigationLink[] = [
{ label: "Arsenal", href: "/category/arsenal" },
{
label: "Transfer News",
href: "/category/transfer-news",
},
{
label: "Injury News",
href: "/category/injury-news",
},
{
label: "Arsenal Women",
href: "/category/women",
},
{
label: "Livescores",
href: "/livescores",
},
{
label: "Shop",
href: "https://shop.arsenaltalks.com",
external: true,
},
];

export default function Header() {
const pathname = usePathname();
const [open, setOpen] = useState(false);

// Close the menu whenever the route changes.
useEffect(() => {
setOpen(false);
}, [pathname]);

// Prevent background scrolling while the menu is open.
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

const renderLinks = (links: NavigationLink[]) =>
links.map((link) => {
const active =
!link.external && isActive(link.href);

  return (
    <Link
      key={link.href}
      href={link.href}
      className={`mobile-link ${
        active ? "active" : ""
      }`}
      aria-current={active ? "page" : undefined}
      onClick={() => setOpen(false)}
      target={link.external ? "_blank" : undefined}
      rel={
        link.external
          ? "noopener noreferrer"
          : undefined
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

return (
<header className="site-header">
{/* HEADER BAR /}
<div className="header-inner">
{/ BRAND */}
<Link
href="/"
className="logo"
aria-label="ArsenalTalks home"
onClick={() => setOpen(false)}
>
ArsenalTalks
</Link>

    {/* MENU BUTTON */}
    <button
      type="button"
      className={`menu-btn ${open ? "open" : ""}`}
      onClick={() => setOpen((value) => !value)}
      aria-label={
        open ? "Close navigation" : "Open navigation"
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

  {/* NAVIGATION MENU */}
  <div
    id="mobile-navigation"
    className={`mobile-menu ${open ? "open" : ""}`}
    aria-hidden={!open}
    inert={!open}
  >
    <nav
      className="mobile-nav"
      aria-label="Main navigation"
    >
      {renderLinks(primaryLinks)}

      <div
        className="mobile-nav-heading"
        aria-hidden="true"
      >
        Explore Arsenal
      </div>

      {renderLinks(categoryLinks)}
    </nav>
  </div>

  {/* BACKDROP */}
  {open && (
    <button
      type="button"
      className="menu-backdrop"
      onClick={() => setOpen(false)}
      aria-label="Close navigation"
      tabIndex={-1}
    />
  )}
</header>

);
}