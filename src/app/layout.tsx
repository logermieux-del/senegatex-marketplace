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
  title: 'Afro Sport — Sports africains en direct',
  description: 'Plateforme premium de suivi sportif africain. Scores en direct, classements, actualités et événements sportifs.',
  keywords: ['sport', 'africain', 'senegal', 'football', 'basketball', 'volleyball', 'live scores'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="bg-secondary-900 text-primary-100 font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
