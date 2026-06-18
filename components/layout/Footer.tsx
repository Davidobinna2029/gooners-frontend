import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">

        <p>© {new Date().getFullYear()} ArsenalTalks</p>

        <div className="footer-links">
          <Link href="/legal/privacy-policy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>

      </div>
    </footer>
  );
}