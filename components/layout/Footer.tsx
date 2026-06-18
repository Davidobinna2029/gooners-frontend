import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* BRAND COLUMN */}
        <div className="footer-brand">
          <h3>ArsenalTalks</h3>
          <p>
            Independent Arsenal FC news covering transfers, fixtures, match
            analysis and breaking stories.
          </p>
        </div>

        {/* NAVIGATION */}
        <div className="footer-column">
          <h4>Navigate</h4>
          <Link href="/">Home</Link>
          <Link href="/news">News</Link>
          <Link href="/fixtures">Fixtures</Link>
        </div>

        {/* LEGAL */}
        <div className="footer-column">
          <h4>Legal</h4>
          <Link href="/legal/privacy-policy">Privacy Policy</Link>
          <Link href="/legal/terms">Terms of Service</Link>
          <Link href="/legal/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} ArsenalTalks. All rights reserved.
        </p>
      </div>
    </footer>
  );
}