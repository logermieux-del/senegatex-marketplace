'use client';

import Link from 'next/link';
import { Search, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Tambacounda'];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-accent-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">Y</span>
              </div>
              <span className="text-xl font-bold text-primary-500 hidden sm:inline font-display">Yombal</span>
            </div>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 px-3 py-1 outline-none text-neutral-900 placeholder-accent-400 font-sans"
                />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
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
    </header>
  );
}
