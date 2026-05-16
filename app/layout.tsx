import "@/styles/globals.css";

export const metadata = {
  title: "ArsenalTalks",
  description:
    "Arsenal News, Transfers, UCL & Live Football",
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