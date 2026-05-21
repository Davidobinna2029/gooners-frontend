import "../styles/globals.css";   // ✅ corrected import path

import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import BreakingTicker from "@/components/home/BreakingTicker";
import Footer from "@/components/layout/Footer";

import { getPosts } from "@/lib/api/wordpress";

export const metadata: Metadata = {
  title: {
    default: "ArsenalTalks",
    template: "%s | ArsenalTalks",
  },

  description:
    "Latest Arsenal news, transfer updates, fixtures, live scores, match analysis and breaking stories.",

  keywords: [
    "Arsenal",
    "Arsenal news",
    "Arsenal transfers",
    "Premier League",
    "Mikel Arteta",
    "ArsenalTalks",
    "football news",
  ],

  openGraph: {
    title: "ArsenalTalks",
    description:
      "Latest Arsenal news, transfer updates, fixtures, live scores and match analysis.",

    url: "https://arsenaltalks.com",

    siteName: "ArsenalTalks",

    locale: "en_GB",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ArsenalTalks",
    description:
      "Latest Arsenal news, transfer updates, fixtures and live scores.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getPosts();

  return (
    <html lang="en">
      <body>
        <Header />

        <BreakingTicker posts={posts.slice(0, 6)} />

        <main>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}