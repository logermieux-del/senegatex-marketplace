import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yombal - Buy & Sell Locally in Senegal',
  description: 'Marketplace for buying and selling locally in Senegal',
  keywords: ['marketplace', 'senegal', 'buy', 'sell', 'classifieds'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
