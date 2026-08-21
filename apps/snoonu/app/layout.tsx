import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Snoonu — Food Delivery',
  description: 'Fast food delivery across Qatar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
