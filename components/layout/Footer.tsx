import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">

        {/* Copyright */}
        <p className="site-footer__copyright">
          © {new Date().getFullYear()} ArsenalTalks
        </p>

        {/* Legal Links */}
        <nav className="site-footer__legal" aria-label="Footer navigation">
          <Link href="/legal/terms">Terms of Use</Link>
          <Link href="/legal/privacy-policy">Privacy Policy</Link>
          <Link href="/legal/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Social Icons */}
        <div className="site-footer__social" aria-label="Social media links">

          {/* Facebook */}
          <a
            href="https://www.facebook.com/share/1bMmNw89n4/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v8h4v-8h3.3l.7-4H13V9c0-.7.3-1 1-1Z" />
            </svg>
          </a>

          {/* X */}
          <a
            href="https://x.com/ArsenalTalk360"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.4l-5-6.5L6.1 22H3l7.2-8.3L2.4 2h6.5l4.5 5.9L18.9 2Zm-1.1 17.8h1.8L7.9 4.1H6L17.8 19.8Z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/arsenaltalk3/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="17.5" cy="6.5" r="1.2" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://m.youtube.com/channel/UCExEFPC-ITeBLSIQP2mxo8w"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23 12s0-4-0.5-5.8c-.3-1-1-1.7-2-2C18.7 3.7 12 3.7 12 3.7s-6.7 0-8.5.5c-1 .3-1.7 1-2 2C1 8 1 12 1 12s0 4 .5 5.8c.3 1 1 1.7 2 2 1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5c1-.3 1.7-1 2-2C23 16 23 12 23 12Z" />
              <path
                d="m10 16 6-4-6-4v8Z"
                fill="white"
              />
            </svg>
          </a>

        </div>

        {/* Disclaimer */}
        <p className="site-footer__disclaimer">
          ArsenalTalks is an independent Arsenal FC news publication
          <br className="site-footer__break" />
          and is not affiliated with or endorsed by Arsenal Football Club.
        </p>

      </div>
    </footer>
  );
}