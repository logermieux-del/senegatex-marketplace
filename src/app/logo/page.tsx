'use client';

import Logo from '@/components/Logo';

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50 to-accent-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-5xl font-bold text-secondary-900 mb-4">
            Afro Sport Logo System
          </h1>
          <p className="text-lg text-secondary-600">
            Baobab élégant et moderne pour la plateforme de livraison premium
          </p>
        </div>

        {/* Main showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Full logo */}
          <div className="bg-white rounded-lg border-2 border-primary-200 p-12 flex items-center justify-center min-h-64">
            <Logo variant="full" size="lg" />
          </div>

          {/* Dark background */}
          <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-lg border-2 border-primary-600 p-12 flex items-center justify-center min-h-64">
            <Logo variant="full" size="lg" />
          </div>
        </div>

        {/* Variants grid */}
        <div className="mb-16">
          <h2 className="font-display text-3xl font-bold text-secondary-900 mb-8">
            Variantes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Full variant sizes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Logo variant="full" size="sm" />
              </div>
              <p className="text-sm text-gray-600 font-mono">variant="full"<br />size="sm"</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Logo variant="full" size="md" />
              </div>
              <p className="text-sm text-gray-600 font-mono">variant="full"<br />size="md"</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Logo variant="full" size="lg" />
              </div>
              <p className="text-sm text-gray-600 font-mono">variant="full"<br />size="lg"</p>
            </div>

            {/* Icon only */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Logo variant="icon" size="lg" />
              </div>
              <p className="text-sm text-gray-600 font-mono">variant="icon"</p>
            </div>

            {/* Text only */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Logo variant="text" size="md" />
              </div>
              <p className="text-sm text-gray-600 font-mono">variant="text"</p>
            </div>

            {/* Dark mode */}
            <div className="bg-secondary-900 rounded-lg border border-primary-600 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Logo variant="full" size="md" />
              </div>
              <p className="text-sm text-primary-400 font-mono">Dark mode</p>
            </div>
          </div>
        </div>

        {/* Design specs */}
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border-2 border-primary-300 p-8 mb-16">
          <h2 className="font-display text-2xl font-bold text-secondary-900 mb-6">
            🎨 Spécifications Design
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg text-primary-600 mb-3">Palette</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-600 rounded border border-gray-300" />
                  <span>Primaire: #2563EB (Bleu confiance)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent-500 rounded border border-gray-300" />
                  <span>Accent: #EA580C (Orange énergie)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded border-2 border-gray-300" />
                  <span>Lumière: Blanc pur</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-primary-600 mb-3">Concept</h3>
              <ul className="space-y-1 text-sm list-disc list-inside text-gray-700">
                <li>Baobab abstrait et épuré</li>
                <li>Racines profondes = stabilité</li>
                <li>Feuillage moderne = croissance</li>
                <li>Pin de localisation = livraison</li>
                <li>Gradient bleu/orange = énergie</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage examples */}
        <div>
          <h2 className="font-display text-2xl font-bold text-secondary-900 mb-6">
            📱 Exemples d'Utilisation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
                <Logo variant="full" size="sm" />
                <div className="flex gap-2">
                  <button className="text-sm px-3 py-1 bg-accent-500 text-white rounded hover:bg-accent-600">
                    Connexion
                  </button>
                </div>
              </div>
              <p className="p-4 text-xs text-gray-500">Header Navigation</p>
            </div>

            {/* Mobile */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-black text-white p-4">
                <div className="flex items-center gap-2">
                  <Logo variant="icon" size="sm" />
                  <span className="text-sm font-bold">Afro Sport</span>
                </div>
              </div>
              <p className="p-4 text-xs text-gray-500">Mobile Header</p>
            </div>

            {/* Hero section */}
            <div className="bg-secondary-900 text-white border border-primary-600 rounded-lg overflow-hidden p-6">
              <div className="flex justify-center mb-4">
                <Logo variant="full" size="md" />
              </div>
              <p className="text-center text-sm">Hero Section</p>
            </div>

            {/* Footer */}
            <div className="bg-secondary-900 text-white border border-primary-600 rounded-lg overflow-hidden p-6">
              <div className="flex items-center gap-3 mb-3">
                <Logo variant="icon" size="sm" />
                <div>
                  <div className="text-xs font-bold">Afro Sport</div>
                  <div className="text-xs text-gray-400">Livraison Premium</div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500">Footer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
