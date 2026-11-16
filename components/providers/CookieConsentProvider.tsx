"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CookiePreferences = {
  essential: true;
  analytics: boolean;
  advertising: boolean;
};

type CookieConsentContextType = {
  preferences: CookiePreferences | null;
  savePreferences: (preferences: CookiePreferences) => void;
  openSettings: () => void;
};

const STORAGE_KEY = "arsenaltalks-cookie-consent";

const CookieConsentContext =
  createContext<CookieConsentContextType | null>(null);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider"
    );
  }

  return context;
}

export default function CookieConsentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [preferences, setPreferences] =
    useState<CookiePreferences | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (
          typeof parsed.analytics === "boolean" &&
          typeof parsed.advertising === "boolean"
        ) {
          setPreferences({
            essential: true,
            analytics: parsed.analytics,
            advertising: parsed.advertising,
          });
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }

    setReady(true);
  }, []);

  const savePreferences = useCallback(
    (nextPreferences: CookiePreferences) => {
      const safePreferences: CookiePreferences = {
        essential: true,
        analytics: nextPreferences.analytics,
        advertising: nextPreferences.advertising,
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(safePreferences)
      );

      setPreferences(safePreferences);
      setSettingsOpen(false);
    },
    []
  );

  const openSettings = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const showBanner = ready && preferences === null;

  return (
    <CookieConsentContext.Provider
      value={{
        preferences,
        savePreferences,
        openSettings,
      }}
    >
      {children}

      {ready && (showBanner || settingsOpen) && (
        <div className="cookie-consent-overlay">
          <section
            className="cookie-consent-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-description"
          >
            <div className="cookie-consent-content">
              <p className="cookie-consent-eyebrow">
                YOUR PRIVACY
              </p>

              <h2 id="cookie-consent-title">
                Your cookie preferences
              </h2>

              <p id="cookie-consent-description">
                ArsenalTalks uses essential storage to operate this
                website. You can choose whether to allow optional
                analytics and advertising technologies. You can
                change your preferences at any time.
              </p>

              {settingsOpen && (
                <div className="cookie-consent-options">
                  <div className="cookie-consent-option">
                    <div>
                      <strong>Essential</strong>
                      <p>
                        Required for core website functionality.
                        These cannot be disabled.
                      </p>
                    </div>
                    <span className="cookie-consent-required">
                      Always on
                    </span>
                  </div>

                  <label className="cookie-consent-option">
                    <div>
                      <strong>Analytics</strong>
                      <p>
                        Allows analytics technologies to measure
                        website usage and performance.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences?.analytics ?? false}
                      onChange={(event) =>
                        setPreferences((current) => ({
                          essential: true,
                          analytics: event.target.checked,
                          advertising: current?.advertising ?? false,
                        }))
                      }
                    />
                  </label>

                  <label className="cookie-consent-option">
                    <div>
                      <strong>Advertising</strong>
                      <p>
                        Allows advertising technologies to use
                        optional storage where applicable.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences?.advertising ?? false}
                      onChange={(event) =>
                        setPreferences((current) => ({
                          essential: true,
                          analytics: current?.analytics ?? false,
                          advertising: event.target.checked,
                        }))
                      }
                    />
                  </label>
                </div>
              )}

              <div className="cookie-consent-actions">
                {!settingsOpen ? (
                  <>
                    <button
                      type="button"
                      className="cookie-button cookie-button-primary"
                      onClick={() =>
                        savePreferences({
                          essential: true,
                          analytics: true,
                          advertising: true,
                        })
                      }
                    >
                      Accept all
                    </button>

                    <button
                      type="button"
                      className="cookie-button cookie-button-secondary"
                      onClick={() =>
                        savePreferences({
                          essential: true,
                          analytics: false,
                          advertising: false,
                        })
                      }
                    >
                      Reject optional
                    </button>

                    <button
                      type="button"
                      className="cookie-button cookie-button-text"
                      onClick={openSettings}
                    >
                      Cookie settings
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="cookie-button cookie-button-primary"
                      onClick={() =>
                        savePreferences({
                          essential: true,
                          analytics: preferences?.analytics ?? false,
                          advertising: preferences?.advertising ?? false,
                        })
                      }
                    >
                      Save preferences
                    </button>

                    <button
                      type="button"
                      className="cookie-button cookie-button-secondary"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Back
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </CookieConsentContext.Provider>
  );
}
