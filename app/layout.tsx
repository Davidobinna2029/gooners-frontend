import "../styles/globals.css";

import type { Metadata } from "next";

import NewsroomHeader from "@/components/layout/NewsroomHeader";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://arsenaltalks.com"),

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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ArsenalTalks",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ArsenalTalks",
    description:
      "Latest Arsenal news, transfer updates, fixtures and live scores.",
    images: ["/og-image.jpg"],
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
        <NewsroomHeader />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}