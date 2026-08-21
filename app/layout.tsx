import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "YakFik - Find the Best Deal Automatically",
  description: "Compare food, medicine and grocery prices across all delivery apps in Qatar",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3D9970",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <div className="mx-auto min-h-screen w-full max-w-md bg-white shadow-2xl lg:max-w-2xl xl:max-w-3xl">
          {children}
        </div>
      </body>
    </html>
  );
}
