
"use client";

import { useState } from "react";

interface Props {
  slug: string;
  title: string;
}

const SITE_URL = "https://arsenaltalks.com";

export default function ShareBar({ slug, title }: Props) {
  const [copied, setCopied] = useState(false);

  const url = `${SITE_URL}/news/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this article link:", url);
    }
  }

  return (
    <div className="article-social-share" aria-label="Share article">
      <a
        className="social-share-icon social-whatsapp"
        href={`https://wa.me/?text=${encodeURIComponent(
          `${title} ${url}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        title="WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.04 2a9.8 9.8 0 0 0-8.42 14.82L2.2 22l5.32-1.39A9.96 9.96 0 0 0 12.04 22h.01A10 10 0 0 0 12.04 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.16.83.84-3.08-.2-.32A8.2 8.2 0 1 1 12.04 20.2Zm4.5-6.14c-.25-.13-1.49-.74-1.72-.82-.23-.08-.4-.13-.57.13-.17.25-.65.82-.8.99-.15.17-.3.19-.56.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.52.11-.11.25-.3.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.12.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.52.6.19 1.15.16 1.58.1.48-.07 1.49-.61 1.7-1.2.21-.59.21-1.09.15-1.2-.06-.1-.23-.17-.48-.29Z"
          />
        </svg>
      </a>

      <a
        className="social-share-icon social-facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        title="Facebook"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.56c0-.93.26-1.56 1.6-1.56h1.7V3.14c-.29-.04-1.29-.14-2.46-.14-2.44 0-4.11 1.49-4.11 4.23V9.6H7.47v3.2h2.76V21h3.27Z"
          />
        </svg>
      </a>

      <a
        className="social-share-icon social-x"
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        title="X"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.42L5.55 22H2.4l7.25-8.29L1.8 2h6.4l4.43 6.77L18.9 2Zm-1.1 18h1.73L7.26 3.89H5.4L17.8 20Z"
          />
        </svg>
      </a>

      <button
        type="button"
        className={`social-share-icon social-copy ${
          copied ? "is-copied" : ""
        }`}
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy article link"}
        title={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="m5 12 4.5 4.5L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M10 13.5a4 4 0 0 0 5.66 0l3-3A4 4 0 0 0 13 4.84l-1.72 1.72M14 10.5a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 13 19.16l1.72-1.72"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <span className="social-copy-feedback" aria-live="polite">
        {copied ? "Copied!" : ""}
      </span>
    </div>
  );
}
