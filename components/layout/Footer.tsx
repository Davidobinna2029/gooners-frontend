import Link from "next/link";

export default function Footer() {
  return (
    <footer className="legal-footer">
      <div className="container">

        <div className="legal-links">
          <Link href="/legal/terms">
            Terms of Use
          </Link>

          <Link href="/legal/privacy-policy">
            Privacy Policy
          </Link>

          <Link href="/legal/about">
            About
          </Link>

          <Link href="/contact">
            Contact
          </Link>
        </div>

        <p className="legal-copyright">
          © {new Date().getFullYear()} ArsenalTalks. All rights reserved.
        </p>

        <p className="legal-disclaimer">
          ArsenalTalks is an independent Arsenal FC news publication and is not
          affiliated with Arsenal Football Club.
        </p>

      </div>
    </footer>
  );
}