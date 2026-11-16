"use client";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";

export default function CookieSettingsButton() {
  const { openSettings } = useCookieConsent();

  return (
    <button
      type="button"
      className="cookie-settings-link"
      onClick={openSettings}
    >
      Cookie Settings
    </button>
  );
}
