'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import { HouseIcon } from '@/components/icons/CategoryIcons';
import { Logo, LogoIcon } from '@/components/layout/Logo';

const cities = ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Tambacounda'];

interface HeaderProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedCity: string;
  onSelectedCityChange: (value: string) => void;
}

export function Header({ searchQuery, onSearchQueryChange, selectedCity, onSelectedCityChange }: HeaderProps) {
  const pathname = usePathname();
  const isImmobilier = pathname?.startsWith('/immobilier');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-accent-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <LogoIcon className="h-10 w-auto sm:hidden" />
            <Logo className="h-11 w-auto hidden sm:block" />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-neutral-50 rounded-lg px-4 py-2 border border-accent-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                <Search className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  data-testid="search-input"
                  className="bg-transparent flex-1 px-3 py-1 outline-none text-neutral-900 placeholder-accent-400 font-sans"
                />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => onSelectedCityChange(e.target.value)}
                data-testid="city-select"
                className="px-4 py-2 bg-neutral-50 border border-accent-300 rounded-lg text-neutral-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all hidden sm:block font-sans"
              >
                <option value="">Toutes villes</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/listings/create"
              className="flex items-center gap-2 bg-success-500 text-white px-4 py-2 rounded-lg hover:bg-success-600 transition-colors font-medium text-sm whitespace-nowrap font-sans"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Vendre</span>
            </Link>
            <Link href="/login" className="text-neutral-700 hover:text-primary-500 transition-colors text-sm font-medium font-sans">
              Connexion
            </Link>
            <Link
              href="/signup"
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm font-sans"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary nav tabs */}
      <div className="border-t border-accent-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1">
            <Link
              href="/immobilier"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium font-sans border-b-2 transition-colors ${
                isImmobilier
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-accent-600 hover:text-primary-500'
              }`}
            >
              <HouseIcon className="w-4 h-4" />
              Immobilier
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
