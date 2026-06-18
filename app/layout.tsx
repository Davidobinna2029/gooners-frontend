import "../styles/globals.css";

import type { Metadata } from "next";
import Script from "next/script";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://arsenaltalks.com"),

  title: {
    default: "ArsenalTalks",
    template: "%s | ArsenalTalks",
  },

  description:
    "Latest Arsenal news, transfer updates, fixtures, match analysis and breaking stories.",

  applicationName: "ArsenalTalks",

  authors: [
    {
      name: "ArsenalTalks Editorial Team",
    },
  ],

  creator: "ArsenalTalks",
  publisher: "ArsenalTalks",

  keywords: [
    "Arsenal",
    "Arsenal News",
    "Arsenal Transfers",
    "Premier League",
    "Mikel Arteta",
    "ArsenalTalks",
    "Football News",
  ],

  openGraph: {
    title: "ArsenalTalks",
    description:
      "Latest Arsenal news, fixtures, transfer updates and match analysis.",
    url: "https://arsenaltalks.com",
    siteName: "ArsenalTalks",
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ArsenalTalks",
    description:
      "Latest Arsenal news, fixtures, transfer updates and match analysis.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7096777123439259"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}