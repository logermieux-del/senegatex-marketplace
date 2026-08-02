'use client';

import Navigation from '@/components/Navigation';
import { useState } from 'react';

export default function Classements() {
  const [selectedRegion, setSelectedRegion] = useState('national');

  const regions = ['national', 'dakar', 'nord', 'sud'];

  const classements = {
    national: [
      { rank: 1, name: 'Samba Express', rating: 4.9, trips: 2340, badge: '🏆 TOP' },
      { rank: 2, name: 'Dakar Logistique', rating: 4.8, trips: 1890, badge: '🚀 Rapide' },
      { rank: 3, name: 'Senegal Delivery', rating: 4.7, trips: 1654, badge: '✓ Fiable' },
      { rank: 4, name: 'Express Sénégal', rating: 4.6, trips: 1432, badge: '📍 Locale' },
      { rank: 5, name: 'Nation Logistics', rating: 4.5, trips: 1210, badge: '💼 Pro' },
      { rank: 6, name: 'Dakar Speed', rating: 4.4, trips: 987, badge: '⚡ Nouveau' },
      { rank: 7, name: 'Senegal Express', rating: 4.3, trips: 845, badge: '📦 Cargo' },
      { rank: 8, name: 'Livraison Plus', rating: 4.2, trips: 654, badge: '🌟 Fiable' },
    ],
    dakar: [
      { rank: 1, name: 'Samba Express', rating: 4.9, trips: 1230, badge: '🏆 TOP' },
      { rank: 2, name: 'Express Sénégal', rating: 4.7, trips: 876, badge: '📍 Locale' },
      { rank: 3, name: 'Dakar Speed', rating: 4.6, trips: 654, badge: '⚡ Nouveau' },
    ],
    nord: [
      { rank: 1, name: 'Saint-Louis Express', rating: 4.8, trips: 567, badge: '🏆 TOP' },
      { rank: 2, name: 'Kaolack Transport', rating: 4.6, trips: 432, badge: '📍 Locale' },
      { rank: 3, name: 'Nation Logistics', rating: 4.5, trips: 345, badge: '💼 Pro' },
    ],
    sud: [
      { rank: 1, name: 'Sud Livraison', rating: 4.7, trips: 456, badge: '🌟 Fiable' },
      { rank: 2, name: 'Transport Sud', rating: 4.5, trips: 345, badge: '📦 Cargo' },
      { rank: 3, name: 'Express Casamance', rating: 4.3, trips: 234, badge: '🚀 Rapide' },
    ],
  };

  const currentClassement = classements[selectedRegion as keyof typeof classements];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-black text-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-display">Classements</h1>
          <p className="text-gray-400">Les meilleurs transporteurs du Sénégal</p>
        </div>

        {/* Region Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-6 py-2 rounded font-bold whitespace-nowrap transition-all ${
                selectedRegion === region
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-800 border border-gray-700 text-gray-400 hover:border-primary-600'
              }`}
            >
              {region === 'national'
                ? '🌍 National'
                : region === 'dakar'
                  ? '🏠 Dakar'
                  : region === 'nord'
                    ? '🔝 Nord'
                    : '🔽 Sud'}
            </button>
          ))}
        </div>

        {/* Ranking Table */}
        <div className="bg-secondary-800 border border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-700 border-b border-gray-700">
                <th className="px-6 py-4 text-left font-bold text-primary-300 text-sm">#</th>
                <th className="px-6 py-4 text-left font-bold text-primary-300 text-sm">
                  Transporteur
                </th>
                <th className="px-6 py-4 text-left font-bold text-primary-300 text-sm">
                  Rating
                </th>
                <th className="px-6 py-4 text-left font-bold text-primary-300 text-sm">
                  Trajets
                </th>
                <th className="px-6 py-4 text-left font-bold text-primary-300 text-sm">
                  Badge
                </th>
              </tr>
            </thead>
            <tbody>
              {currentClassement.map((transporter, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 hover:bg-secondary-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-2xl font-bold text-orange-500">
                      #{transporter.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        👤
                      </div>
                      <div>
                        <div className="font-bold text-sm">{transporter.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-orange-500 font-bold">
                      {transporter.rating} ⭐
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{transporter.trips.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded">
                      {transporter.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold mb-2">
              {currentClassement.reduce((sum, t) => sum + t.trips, 0).toLocaleString()}
            </div>
            <div className="text-primary-100">Total trajets</div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold mb-2">
              {(
                currentClassement.reduce((sum, t) => sum + t.rating, 0) /
                currentClassement.length
              ).toFixed(1)}
            </div>
            <div className="text-orange-100">Rating moyen ⭐</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold mb-2">{currentClassement.length}</div>
            <div className="text-green-100">Transporteurs classés</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-secondary-800 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary-300">📊 Comment sont calculés les classements?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-bold mb-2">Rating Client</h3>
              <p className="text-sm text-gray-400">
                Basé sur les évaluations des clients après chaque livraison
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold mb-2">Rapidité</h3>
              <p className="text-sm text-gray-400">
                Temps moyen de livraison et respect des délais
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-bold mb-2">Volume Trajets</h3>
              <p className="text-sm text-gray-400">
                Nombre total de trajets complétés avec succès
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
