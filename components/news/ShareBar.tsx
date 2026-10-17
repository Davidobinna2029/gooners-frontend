
"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  slug: string;
  title: string;
}

const SITE_URL = "https://arsenaltalks.com";

export default function ShareBar({ slug, title }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const url = `${SITE_URL}/news/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
    );
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.prompt("Copy this article link:", url);
    }
  }

  async function nativeShare() {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title,
        text: title,
        url,
      });

      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Unable to share article:", error);
      }
    }
  }

  return (
    <div className="share-container" ref={popupRef}>
      <button
        type="button"
        className="share-trigger"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Share this article"
      >
        <svg
          viewBox="0 0 24 24"
          width="19"
          height="19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
        </svg>

        <span>Share</span>
      </button>

      {isOpen && (
        <div
          className="share-popup"
          role="dialog"
          aria-label="Share article options"
        >
          <div className="share-popup-header">
            <div>
              <strong>Share this article</strong>
              <p>Spread the latest Arsenal news.</p>
            </div>

            <button
              type="button"
              className="share-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close share options"
            >
              &times;
            </button>
          </div>

          <div className="share-options">
            <a
              className="share-option whatsapp"
              href={`https://wa.me/?text=${encodeURIComponent(
                `${title} ${url}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              <span className="share-option-icon" aria-hidden="true">
                WA
              </span>
              <span>WhatsApp</span>
            </a>

            <a
              className="share-option facebook"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              <span className="share-option-icon" aria-hidden="true">
                f
              </span>
              <span>Facebook</span>
            </a>

            <a
              className="share-option x-share"
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              <span className="share-option-icon" aria-hidden="true">
                X
              </span>
              <span>Post on X</span>
            </a>

            {canNativeShare && (
              <button
                type="button"
                className="share-option native-share"
                onClick={nativeShare}
              >
                <span className="share-option-icon" aria-hidden="true">
                  ↗
                </span>
                <span>More options</span>
              </button>
            )}
          </div>

          <div className="share-copy-section">
            <span className="share-link-label">Article link</span>

            <div className="share-link-row">
              <input
                type="text"
                value={url}
                readOnly
                aria-label="Article URL"
                onFocus={(event) => event.currentTarget.select()}
              />

              <button
                type="button"
                className="share-copy-button"
                onClick={copyLink}
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>

            <p className="share-feedback" aria-live="polite">
              {copied ? "Article link copied to clipboard." : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
