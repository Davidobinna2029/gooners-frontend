"use client";

import Link from "next/link";

export default function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="drawer" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <Link href="/">Home</Link>
        <Link href="/news">News</Link>
        <Link href="/transfers">Transfers</Link>
        <Link href="/opinion">Opinion</Link>
        <Link href="/fixtures">Fixtures</Link>
      </div>
    </div>
  );
}