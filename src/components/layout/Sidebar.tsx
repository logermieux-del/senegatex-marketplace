'use client';

import { Smartphone, Armchair, Car, Shirt, Briefcase, MoreHorizontal } from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: '', label: 'Toutes les catégories', icon: MoreHorizontal },
  { id: 'electronics', label: 'Électronique', icon: Smartphone },
  { id: 'furniture', label: 'Meubles', icon: Armchair },
  { id: 'vehicles', label: 'Véhicules', icon: Car },
  { id: 'clothing', label: 'Vêtements', icon: Shirt },
  { id: 'services', label: 'Services', icon: Briefcase },
];

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-neutral-200 p-6 h-fit sticky top-20">
      <h2 className="text-lg font-bold text-neutral-900 mb-6">Catégories</h2>

      <nav className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                isActive
                  ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Popular searches */}
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <h3 className="text-sm font-bold text-neutral-900 mb-4">Recherches populaires</h3>
        <div className="space-y-2">
          {['iPhone 13', 'MacBook', 'Sofa', 'Moto'].map((search) => (
            <button
              key={search}
              className="w-full text-left text-sm text-neutral-600 hover:text-primary-500 py-2 transition-colors"
            >
              • {search}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
