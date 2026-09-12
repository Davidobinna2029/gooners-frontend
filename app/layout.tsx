import "../styles/globals.css";

import type { Metadata } from "next";
import Script from "next/script";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/SessionProvider";

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

  /* ========================================================
     ARSENALTALKS FAVICON / SITE ICON
  ======================================================== */

  icons: {
    icon: [
      {
        url: "/images/arsenaltalks-logo.png",
        type: "image/png",
      },
    ],

    shortcut: "/images/arsenaltalks-logo.png",

    apple: [
      {
        url: "/images/arsenaltalks-logo.png",
        type: "image/png",
      },
    ],
  },

  /* ========================================================
     OPEN GRAPH
  ======================================================== */

  openGraph: {
    title: "ArsenalTalks",

    description:
      "Latest Arsenal news, fixtures, transfer updates and match analysis.",

    url: "https://arsenaltalks.com",

    siteName: "ArsenalTalks",

    locale: "en_GB",

    type: "website",

    images: [
      {
        url: "/images/arsenaltalks-logo.png",
        width: 512,
        height: 512,
        alt: "ArsenalTalks",
      },
    ],
  },

  /* ========================================================
     X / TWITTER
  ======================================================== */

  twitter: {
    card: "summary_large_image",

    title: "ArsenalTalks",

    description:
      "Latest Arsenal news, fixtures, transfer updates and match analysis.",

    images: ["/images/arsenaltalks-logo.png"],
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
        <AuthProvider>
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7096777123439259"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />

          <Header />

          <main>{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}