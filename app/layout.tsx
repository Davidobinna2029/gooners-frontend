import "../styles/globals.css";

import type { Metadata } from "next";
import Script from "next/script";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/SessionProvider";

const SITE_URL = "https://arsenaltalks.com";
const SITE_NAME = "ArsenalTalks";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Latest Arsenal news, transfer updates, fixtures, match analysis and breaking stories.",

  applicationName: SITE_NAME,

  authors: [
    {
      name: "ArsenalTalks Editorial Team",
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  keywords: [
    "Arsenal",
    "Arsenal News",
    "Arsenal Transfers",
    "Premier League",
    "Mikel Arteta",
    "ArsenalTalks",
    "Football News",
  ],

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

  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE_NAME,
    url: SITE_URL,

    title: SITE_NAME,

    description:
      "Latest Arsenal news, fixtures, transfer updates and match analysis.",

    images: [
      {
        url: `${SITE_URL}/images/arsenaltalks-logo.png`,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: SITE_NAME,

    description:
      "Latest Arsenal news, fixtures, transfer updates and match analysis.",

    images: [`${SITE_URL}/images/arsenaltalks-logo.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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