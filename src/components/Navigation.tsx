'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Menu, X, Play, BarChart3, Heart } from 'lucide-react';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'ACCUEIL', icon: '🏠' },
    { href: '/livraisons', label: 'SCORES EN DIRECT', icon: '📊' },
    { href: '/classements', label: 'CLASSEMENTS', icon: '🏆' },
    { href: '/actualites', label: 'ACTUALITÉS', icon: '📰' },
    { href: '/pour-vous', label: 'POUR VOUS', icon: '❤️' },
  ];

  return (
    <>
      {/* Main Header */}
      <header className="bg-black border-b border-primary-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link href="/">
            <Logo variant="full" size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-400 hover:text-primary-400 font-medium text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
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
          <div className="md:hidden bg-secondary-900 border-t border-primary-600">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-gray-300 hover:text-primary-400 border-b border-secondary-700 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Tab Navigation (for mobile) */}
      <div className="md:hidden bg-black border-b border-primary-600 sticky top-16 z-40">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 py-3 text-center text-xs font-bold text-gray-400 hover:text-primary-400 hover:bg-secondary-900 transition-colors"
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="hidden sm:block">{item.label.split(' ')[0]}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
