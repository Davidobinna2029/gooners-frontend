import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ArsenalTalks",
  description:
    "Arsenal news, live scores, transfers and fan coverage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}