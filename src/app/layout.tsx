import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthSessionProvider } from '@/components/providers/AuthSessionProvider';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yembal - Acheter. Vendre. Simplement.',
  description: 'Yembal, la marketplace pour acheter et vendre localement au Sénégal.',
  keywords: ['marketplace', 'senegal', 'acheter', 'vendre', 'petites annonces'],
  openGraph: {
    title: 'Yembal - Acheter. Vendre. Simplement.',
    description: 'La marketplace pour acheter et vendre localement au Sénégal.',
    locale: 'fr_SN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={plusJakartaSans.variable}>
      <body className="bg-neutral-50 text-neutral-900 font-sans">
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
