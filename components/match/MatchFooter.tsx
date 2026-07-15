// components/match/MatchFooter.tsx

import Link from "next/link";

interface Props {
  href: string;
}

export default function MatchFooter({ href }: Props) {
  return (
    <footer className="border-t border-gray-200 pt-4">
      <Link
        href={href}
        className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Open Match Centre →
      </Link>
    </footer>
  );
}