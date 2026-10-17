
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

  const containerRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const url = `${SITE_URL}/news/${slug}`;

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
    );

    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function copyLink() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.prompt("Copy this article link:", url);
    }
  }

  async function shareNatively() {
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

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="share-container" ref={containerRef}>
      <button
        type="button"
        className={`share-trigger ${isOpen ? "share-trigger-active" : ""}`}
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Share this article"
      >
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
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
          aria-label="Share article"
        >
          <div className="share-popup-header">
            <div>
              <strong>Share this article</strong>
              <p>Share this story with others.</p>
            </div>

            <button
              type="button"
              className="share-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close share menu"
            >
              ×
            </button>
          </div>

          <div className="share-options">
            <a
              className="share-option"
              href={`https://wa.me/?text=${encodeURIComponent(
                `${title} ${url}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              <span className="share-option-icon whatsapp-icon">WA</span>
              <span>WhatsApp</span>
            </a>

            <a
              className="share-option"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              <span className="share-option-icon facebook-icon">f</span>
              <span>Facebook</span>
            </a>

            <a
              className="share-option"
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              <span className="share-option-icon x-icon">X</span>
              <span>Post on X</span>
            </a>

            {canNativeShare && (
              <button
                type="button"
                className="share-option"
                onClick={shareNatively}
              >
                <span className="share-option-icon more-icon">↗</span>
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
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>

            <p className="share-feedback" aria-live="polite">
              {copied ? "Link copied to clipboard." : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
