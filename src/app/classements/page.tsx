'use client';

import Navigation from '@/components/Navigation';
import { useState } from 'react';

export default function Classements() {
  const [selectedRegion, setSelectedRegion] = useState('national');

  const regions = ['national', 'football', 'basketball', 'volley'];

  const classements = {
    national: [
      { rank: 1, name: 'Dakar FC', rating: 4.9, trips: 23, badge: '🏆 TOP' },
      { rank: 2, name: 'Thiès United', rating: 4.8, trips: 20, badge: '🥈 Argent' },
      { rank: 3, name: 'Saint-Louis Racing', rating: 4.7, trips: 19, badge: '🥉 Bronze' },
      { rank: 4, name: 'Kaolack Athletic', rating: 4.6, trips: 17, badge: '⚡ Montant' },
      { rank: 5, name: 'Rufisque Sports', rating: 4.5, trips: 16, badge: '💪 Fort' },
      { rank: 6, name: 'Ziguinchor Stars', rating: 4.4, trips: 14, badge: '🌟 Talent' },
      { rank: 7, name: 'Kolda Warriors', rating: 4.3, trips: 12, badge: '🔥 Jeune' },
      { rank: 8, name: 'Louga Elite', rating: 4.2, trips: 10, badge: '⚽ Vaillant' },
    ],
    football: [
      { rank: 1, name: 'Dakar FC', rating: 4.9, trips: 25, badge: '🏆 TOP' },
      { rank: 2, name: 'Thiès United', rating: 4.7, trips: 22, badge: '🥈 Challenger' },
      { rank: 3, name: 'Saint-Louis FC', rating: 4.6, trips: 20, badge: '⚡ Dynamique' },
    ],
    basketball: [
      { rank: 1, name: 'Basket Dakar', rating: 4.8, trips: 24, badge: '🏆 TOP' },
      { rank: 2, name: 'Thiès Basketball', rating: 4.6, trips: 18, badge: '🥈 Fort' },
      { rank: 3, name: 'Kaolack Sports', rating: 4.5, trips: 16, badge: '🎯 Précis' },
    ],
    volley: [
      { rank: 1, name: 'Volley Dakar', rating: 4.7, trips: 21, badge: '🏆 TOP' },
      { rank: 2, name: 'ASC Sénégal', rating: 4.5, trips: 18, badge: '🥈 Rival' },
      { rank: 3, name: 'Volley Thiès', rating: 4.4, trips: 15, badge: '⚡ Remontant' },
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
          <p className="text-gray-400">Les meilleurs équipes et athlètes du Sénégal</p>
        </div>

        {/* Sport Tabs */}
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
                ? '🌍 All Sports'
                : region === 'football'
                  ? '⚽ Football'
                  : region === 'basketball'
                    ? '🏀 Basketball'
                    : '🏐 Volleyball'}
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
                  Équipe
                </th>
                <th className="px-6 py-4 text-left font-bold text-primary-300 text-sm">
                  Rating
                </th>
                <th className="px-6 py-4 text-left font-bold text-primary-300 text-sm">
                  Matchs
                </th>
                <th className="px-6 py-4 text-left font-bold text-primary-300 text-sm">
                  Status
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
            <div className="text-primary-100">Matchs joués</div>
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
            <div className="text-green-100">Équipes classées</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-secondary-800 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary-300">📊 Comment sont calculés les classements?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-bold mb-2">Performance</h3>
              <p className="text-sm text-gray-400">
                Basé sur les résultats sportifs et victoires enregistrées
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold mb-2">Consistency</h3>
              <p className="text-sm text-gray-400">
                Régularité des résultats et stabilité tout au long de la saison
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold mb-2">Points</h3>
              <p className="text-sm text-gray-400">
                Points gagnés: 3 pour victoire, 1 pour match nul, 0 pour défaite
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
