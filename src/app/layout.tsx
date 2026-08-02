import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-sans',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-display',
});

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
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="bg-white text-secondary-900 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
