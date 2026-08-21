import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yakfik - Find the Best Deal Automatically",
  description: "Compare food, medicine and grocery prices across all delivery apps in Qatar",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#379566",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ background: "var(--bg)" }}>
        {/* No max-width here – let the page.tsx handle it */}
        {children}
      </body>
    </html>
  );
}
