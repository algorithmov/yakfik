import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Talabat — Food Delivery',
  description: 'Order food fast from top restaurants in Qatar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
