"use client";

import MegaNavbar from "./MegaNavbar";
import BreakingTicker from "./BreakingTicker";
import SearchOverlay from "./SearchOverlay";
import MobileDrawer from "./MobileDrawer";

import { useState } from "react";

export default function NewsroomHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* TOP BREAKING STRIP */}
      <BreakingTicker />

      {/* MAIN SKY-STYLE NAV */}
      <MegaNavbar />

      {/* SEARCH OVERLAY */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}