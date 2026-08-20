import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yakfik – Best Food Delivery Deals in Qatar',
  description: 'AI-powered price & deal comparison across Snoonu, Talabat, Keeta, and Rafeeq',
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
