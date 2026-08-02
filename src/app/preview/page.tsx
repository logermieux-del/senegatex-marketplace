'use client';

import Logo from '@/components/Logo';
import { ChevronRight, Play, BarChart3, Newspaper, Heart } from 'lucide-react';

export default function ArchitecturePreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-primary-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Logo variant="full" size="sm" />
          <div className="text-sm text-primary-400">Architecture Preview</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Design Eurosport pour Afro Sport
          </h1>
          <p className="text-xl text-primary-300">
            Inspiré par le design sportif minimaliste & performant de Eurosport.fr
          </p>
        </div>

        {/* Overview Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-primary-400">
            📋 Vue d'ensemble
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Design Principles */}
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 border border-primary-600 rounded-lg p-8">
              <h3 className="text-xl font-bold text-primary-300 mb-4">Design Principles</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-primary-500">▸</span>
                  <span><strong>Dark Mode:</strong> Fond noir/gris foncé (comme Eurosport mobile)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-500">▸</span>
                  <span><strong>Contraste:</strong> Bleu primaire + blanc pour lisibilité max</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-500">▸</span>
                  <span><strong>Minimalisme:</strong> Épuré, pas de déco inutile</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-500">▸</span>
                  <span><strong>Carousels:</strong> Sections scrollables horizontales</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-500">▸</span>
                  <span><strong>Cards:</strong> Résultats en cartes minimalistes</span>
                </li>
              </ul>
            </div>

            {/* Adaptation pour Livraison */}
            <div className="bg-gradient-to-br from-accent-500 to-accent-600 bg-opacity-20 border border-accent-500 rounded-lg p-8">
              <h3 className="text-xl font-bold text-accent-300 mb-4">🚚 Adaptation Livraison</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-accent-400">▸</span>
                  <span><strong>Matchs →</strong> Trajets/Routes</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-400">▸</span>
                  <span><strong>Scores →</strong> État livraison (Livré, En cours)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-400">▸</span>
                  <span><strong>Équipes →</strong> Transporteurs</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-400">▸</span>
                  <span><strong>Mercato →</strong> Nouvelles routes/services</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-400">▸</span>
                  <span><strong>Joueurs →</strong> Profils transporteurs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pages Architecture */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-primary-400">
            🏗️ Architecture Pages
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Page 1: Homepage */}
            <div className="bg-secondary-800 border border-gray-700 rounded-lg overflow-hidden hover:border-primary-500 transition-colors">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <h3 className="text-xl font-bold">1️⃣ Homepage (Découverte)</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-primary-400" />
                    <span><strong>Hero:</strong> "Suivez vos livraisons en temps réel"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Carousel 1:</strong> Trajets vedettes du jour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Carousel 2:</strong> Top transporteurs (profils)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Carousel 3:</strong> Actualités/Événements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Section:</strong> "Pour vous" (personnalisé)</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700 text-xs text-gray-400">
                  Style: Hero image grande + sections scrollables + personnalisation
                </div>
              </div>
            </div>

            {/* Page 2: Scores en Direct */}
            <div className="bg-secondary-800 border border-gray-700 rounded-lg overflow-hidden hover:border-primary-500 transition-colors">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <h3 className="text-xl font-bold">2️⃣ Scores en Direct (État)</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary-400" />
                    <span><strong>Tab Navigation:</strong> [REGARDER] [SCORES] [POUR VOUS]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Date Selector:</strong> "AUJOURD'HUI" / Demain / etc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Cards:</strong> Trajets + état (Dakar→Thiès: Livré)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Status Badges:</strong> En cours, Livré, Retard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Live Updates:</strong> Rafraîchir en temps réel</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700 text-xs text-gray-400">
                  Style: Minimaliste, centré sur cartes de résultats, dark mode intensif
                </div>
              </div>
            </div>

            {/* Page 3: Classements */}
            <div className="bg-secondary-800 border border-gray-700 rounded-lg overflow-hidden hover:border-primary-500 transition-colors">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <h3 className="text-xl font-bold">3️⃣ Classements (Transporteurs)</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary-400" />
                    <span><strong>Tabs:</strong> Par région / National / Catégorie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Ranking Table:</strong> #1 Samba Express (4.9 ⭐)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Stats:</strong> Trajets complétés, Satisfaction, Rapidité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Cards:</strong> Profil transporteur clickable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Badges:</strong> "Top Transporteur", "Rapide", "Fiable"</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700 text-xs text-gray-400">
                  Style: Classement avec stats détaillées, filters par critères
                </div>
              </div>
            </div>

            {/* Page 4: Actualités */}
            <div className="bg-secondary-800 border border-gray-700 rounded-lg overflow-hidden hover:border-primary-500 transition-colors">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <h3 className="text-xl font-bold">4️⃣ Actualités (News)</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-primary-400" />
                    <span><strong>"À la Une":</strong> Article vedette + image</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Catégories:</strong> TRANSFERTS, ROUTES, SERVICES, ÉVÉNEMENTS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Articles:</strong> Liste avec image + titre + timestamp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Engagement:</strong> Likes, partages, commentaires</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-400" />
                    <span><strong>Latest:</strong> "DERNIÈRES INFOS" link</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700 text-xs text-gray-400">
                  Style: Eurosport news layout, héros image + article list
                </div>
              </div>
            </div>

            {/* Page 5: Pour Vous */}
            <div className="bg-secondary-800 border border-gray-700 rounded-lg overflow-hidden hover:border-primary-500 transition-colors lg:col-span-2">
              <div className="bg-gradient-to-r from-accent-600 to-accent-500 px-6 py-4">
                <h3 className="text-xl font-bold">5️⃣ Pour Vous (Personnalisé)</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-accent-400" />
                    <span><strong>Favoris:</strong> Transporteurs + routes sauvegardés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-accent-400" />
                    <span><strong>Suivi Trajets:</strong> Vos envois en cours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-accent-400" />
                    <span><strong>Recommandations:</strong> Basé sur historique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-accent-400" />
                    <span><strong>Notifications:</strong> Alertes trajets, nouveaux transporteurs</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700 text-xs text-gray-400">
                  Style: Sectionnel, personnalisé par utilisateur
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Library */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-primary-400">
            🧩 Composants Clés
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Component 1 */}
            <div className="bg-secondary-800 border border-gray-600 rounded-lg p-4">
              <div className="bg-blue-600 bg-opacity-30 border-l-4 border-blue-500 px-3 py-2 mb-3">
                <div className="font-bold text-blue-300 text-sm">Header</div>
              </div>
              <p className="text-xs text-gray-400">
                Logo + Menu hamburger (mobile) + Icons nav (REGARDER, SCORES, POUR VOUS)
              </p>
            </div>

            {/* Component 2 */}
            <div className="bg-secondary-800 border border-gray-600 rounded-lg p-4">
              <div className="bg-blue-600 bg-opacity-30 border-l-4 border-blue-500 px-3 py-2 mb-3">
                <div className="font-bold text-blue-300 text-sm">Hero Section</div>
              </div>
              <p className="text-xs text-gray-400">
                Image grande + overlay title + CTA buttons. Gradient bleu/noir.
              </p>
            </div>

            {/* Component 3 */}
            <div className="bg-secondary-800 border border-gray-600 rounded-lg p-4">
              <div className="bg-blue-600 bg-opacity-30 border-l-4 border-blue-500 px-3 py-2 mb-3">
                <div className="font-bold text-blue-300 text-sm">Carousel Horizontal</div>
              </div>
              <p className="text-xs text-gray-400">
                Sections scrollables, chevrons L/R, snap-to-center sur mobile.
              </p>
            </div>

            {/* Component 4 */}
            <div className="bg-secondary-800 border border-gray-600 rounded-lg p-4">
              <div className="bg-orange-600 bg-opacity-30 border-l-4 border-orange-500 px-3 py-2 mb-3">
                <div className="font-bold text-orange-300 text-sm">Result Card</div>
              </div>
              <p className="text-xs text-gray-400">
                Dakar → Thiès | Logo + Score + Logo | Status badge | Timestamp
              </p>
            </div>

            {/* Component 5 */}
            <div className="bg-secondary-800 border border-gray-600 rounded-lg p-4">
              <div className="bg-orange-600 bg-opacity-30 border-l-4 border-orange-500 px-3 py-2 mb-3">
                <div className="font-bold text-orange-300 text-sm">Article Card</div>
              </div>
              <p className="text-xs text-gray-400">
                Image carré + Catégorie badge + Titre + Timestamp + Like button
              </p>
            </div>

            {/* Component 6 */}
            <div className="bg-secondary-800 border border-gray-600 rounded-lg p-4">
              <div className="bg-orange-600 bg-opacity-30 border-l-4 border-orange-500 px-3 py-2 mb-3">
                <div className="font-bold text-orange-300 text-sm">Ranking Table</div>
              </div>
              <p className="text-xs text-gray-400">
                #1 Samba | Rating | Trajets | Badge. Alternating row colors.
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-primary-400">
            🎨 Palette Couleurs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary-600 rounded-lg p-8 text-center">
              <div className="text-sm font-mono text-primary-100">#2563EB</div>
              <div className="text-xs text-primary-200 mt-2">Primaire (Confiance)</div>
            </div>
            <div className="bg-accent-500 rounded-lg p-8 text-center">
              <div className="text-sm font-mono text-white">#EA580C</div>
              <div className="text-xs text-accent-100 mt-2">Accent (Énergie)</div>
            </div>
            <div className="bg-secondary-800 border border-gray-600 rounded-lg p-8 text-center">
              <div className="text-sm font-mono text-gray-400">#1a1a1a</div>
              <div className="text-xs text-gray-500 mt-2">Fond Dark</div>
            </div>
            <div className="bg-white rounded-lg p-8 text-center border border-gray-300">
              <div className="text-sm font-mono text-gray-900">#FFFFFF</div>
              <div className="text-xs text-gray-600 mt-2">Texte/Light</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-primary-400">
            📅 Roadmap Implementation
          </h2>

          <div className="space-y-4">
            <div className="bg-secondary-800 border-l-4 border-primary-600 px-6 py-4 rounded">
              <div className="flex items-start gap-4">
                <div className="bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                <div>
                  <h3 className="font-bold text-primary-300">Refactor Homepage (Eurosport-style)</h3>
                  <p className="text-sm text-gray-400 mt-1">Hero + 3-4 carousels horizontaux + sections scrollables</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary-800 border-l-4 border-primary-600 px-6 py-4 rounded">
              <div className="flex items-start gap-4">
                <div className="bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                <div>
                  <h3 className="font-bold text-primary-300">Create "Scores en Direct" Page</h3>
                  <p className="text-sm text-gray-400 mt-1">État livraisons en temps réel, cartes minimalistes, date selector</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary-800 border-l-4 border-primary-600 px-6 py-4 rounded">
              <div className="flex items-start gap-4">
                <div className="bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                <div>
                  <h3 className="font-bold text-primary-300">Create "Classements" Page</h3>
                  <p className="text-sm text-gray-400 mt-1">Ranking table transporteurs, stats détaillées, tabs par région</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary-800 border-l-4 border-primary-600 px-6 py-4 rounded">
              <div className="flex items-start gap-4">
                <div className="bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                <div>
                  <h3 className="font-bold text-primary-300">Create "Actualités" Page</h3>
                  <p className="text-sm text-gray-400 mt-1">Articles "À la Une" + news grid, catégories, engagement</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary-800 border-l-4 border-accent-500 px-6 py-4 rounded">
              <div className="flex items-start gap-4">
                <div className="bg-accent-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">5</div>
                <div>
                  <h3 className="font-bold text-accent-300">Create "Pour Vous" Page</h3>
                  <p className="text-sm text-gray-400 mt-1">Personnalisé: favoris, suivi trajets, recommandations, notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Prêt à implémenter?</h3>
          <p className="text-primary-100 mb-6">
            Cette architecture créera un site cohérent, performant, et inspiré par Eurosport
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 font-bold rounded hover:bg-gray-100 transition-colors">
            Commencer l'implémentation →
          </button>
        </div>
      </div>
    </div>
  );
}
