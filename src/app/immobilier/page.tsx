'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { IconBadge } from '@/components/icons/IconBadge';
import { HouseIcon, LandPlotIcon, ShieldCheckIcon } from '@/components/icons/CategoryIcons';

const sections = [
  {
    href: '/immobilier/location',
    label: 'Location',
    description: 'Trouvez un appartement, une maison ou un terrain à louer',
    icon: ShieldCheckIcon,
  },
  {
    href: '/immobilier/achat',
    label: 'Achat',
    description: 'Achetez un bien bâti ou un terrain non bâti',
    icon: HouseIcon,
  },
  {
    href: '/immobilier/vente',
    label: 'Vente',
    description: 'Mettez en vente votre bien bâti ou votre terrain',
    icon: LandPlotIcon,
  },
];

export default function ImmobilierPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCity={selectedCity}
        onSelectedCityChange={setSelectedCity}
      />
      <div className="min-h-screen bg-neutral-50">
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary-500 font-display">Immobilier</h1>
            <p className="text-accent-600 mt-2 font-sans">
              Location, achat et vente de biens bâtis ou non bâtis au Sénégal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group flex flex-col items-center text-center gap-3 p-8 bg-white rounded-xl border border-accent-200 hover:border-primary-300 hover:shadow-lg transition-all"
                >
                  <IconBadge size={76}>
                    <Icon className="w-9 h-9" />
                  </IconBadge>
                  <h2 className="text-lg font-bold text-neutral-900 font-sans">{section.label}</h2>
                  <p className="text-sm text-accent-600 font-sans">{section.description}</p>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
