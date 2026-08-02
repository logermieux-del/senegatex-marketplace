'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Menu, X, Zap, BarChart3, Trophy, Newspaper, User } from 'lucide-react';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/accueil', label: 'ACCUEIL', icon: Zap },
    { href: '/scores', label: 'SCORES EN DIRECT', icon: BarChart3 },
    { href: '/classements', label: 'CLASSEMENTS', icon: Trophy },
    { href: '/actualites', label: 'ACTUALITÉS', icon: Newspaper },
    { href: '/pour-vous', label: 'MON PROFIL', icon: User },
  ];

  return (
    <>
      {/* Premium Header */}
      <header className="bg-secondary-900 border-b border-secondary-700 sticky top-0 z-50 backdrop-blur-md bg-secondary-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/accueil" className="flex items-center gap-2">
            <Logo variant="full" size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 flex items-center gap-2 text-primary-300 hover:text-blue-400 hover:bg-secondary-800 rounded-lg font-medium text-sm transition-all duration-300 uppercase tracking-wide"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex gap-3">
            <button className="px-4 py-2 text-primary-400 hover:text-blue-400 transition-colors font-medium text-sm">
              Connexion
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm uppercase tracking-wide">
              S'inscrire
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-primary-300 hover:text-blue-400 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden bg-secondary-800 border-t border-secondary-700">
            <nav className="flex flex-col">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-3 flex items-center gap-3 text-primary-300 hover:text-blue-400 hover:bg-secondary-700 border-b border-secondary-600 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button className="px-4 py-3 text-left text-primary-300 hover:text-blue-400 hover:bg-secondary-700 border-b border-secondary-600">
                Connexion
              </button>
              <button className="px-4 py-3 text-left text-white bg-blue-500 hover:bg-blue-600 font-medium uppercase tracking-wide">
                S'inscrire
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
