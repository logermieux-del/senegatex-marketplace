'use client';

import Navigation from '@/components/Navigation';
import { ResultCard } from '@/components/Cards';
import { useState } from 'react';

export default function Livraisons() {
  const [selectedDate, setSelectedDate] = useState('today');

  const dateOptions = [
    { id: 'today', label: "AUJOURD'HUI", date: '2 août' },
    { id: 'tomorrow', label: 'DEMAIN', date: '3 août' },
    { id: 'saturday', label: 'SAMEDI', date: '4 août' },
    { id: 'sunday', label: 'DIMANCHE', date: '5 août' },
  ];

  const matches = {
    today: [
      { from: 'Dakar FC', to: 'Saint-Louis United', status: 'en-cours', timestamp: '75\'', transporter: 'Football - Ligue 1' },
      { from: 'Thiès Basketball', to: 'Kaolack Sports', status: 'livré', timestamp: 'Fibal', transporter: 'Basketball - D1' },
      { from: 'Volley Dakar', to: 'ASC Sénégal', status: 'retard', timestamp: 'Reporté', transporter: 'Volley - National' },
      { from: 'Tennis Kaolack', to: 'Dakar Tennis Club', status: 'en-cours', timestamp: '2ème set', transporter: 'Tennis - Open' },
    ],
    tomorrow: [
      { from: 'Dakar FC', to: 'Rufisque Sports', status: 'livré', timestamp: '09:30', transporter: 'Football - Ligue 1' },
      { from: 'Thiès United', to: 'Saint-Louis', status: 'livré', timestamp: '14:15', transporter: 'Football - Ligue 2' },
      { from: 'Basket Dakar', to: 'Basket Thiès', status: 'en-cours', timestamp: '16:45', transporter: 'Basketball - D1' },
    ],
    saturday: [
      { from: 'Dakar FC', to: 'Ziguinchor FC', status: 'en-cours', timestamp: '08:00', transporter: 'Football - Championnat' },
      { from: 'Volley Thiès', to: 'Volley Kaolack', status: 'en-cours', timestamp: '11:20', transporter: 'Volley - National' },
    ],
    sunday: [
      { from: 'Marathon Dakar', to: 'All Athletes', status: 'en-cours', timestamp: '10:00', transporter: 'Athlétisme - National' },
    ],
  };

  const stats = {
    today: { total: 4, livred: 1, enCours: 2, retard: 1 },
    tomorrow: { total: 3, livred: 2, enCours: 1, retard: 0 },
    saturday: { total: 2, livred: 0, enCours: 2, retard: 0 },
    sunday: { total: 1, livred: 0, enCours: 1, retard: 0 },
  };

  const currentMatches =
    matches[selectedDate as keyof typeof matches] || matches.today;
  const currentStats =
    stats[selectedDate as keyof typeof stats] || stats.today;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-black text-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-display">Scores en Direct</h1>
          <p className="text-gray-400">Suivez tous les matchs et événements sportifs en temps réel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-secondary-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">
              {currentStats.total}
            </div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="bg-secondary-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {currentStats.livred}
            </div>
            <div className="text-sm text-gray-400">Terminés</div>
          </div>
          <div className="bg-secondary-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {currentStats.enCours}
            </div>
            <div className="text-sm text-gray-400">En direct</div>
          </div>
          <div className="bg-secondary-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {currentStats.retard}
            </div>
            <div className="text-sm text-gray-400">Reportés</div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-primary-300 mb-4">Sélectionnez une date</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {dateOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedDate(option.id)}
                className={`px-6 py-3 rounded font-bold whitespace-nowrap transition-all ${
                  selectedDate === option.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-800 border border-gray-700 text-gray-400 hover:border-primary-600'
                }`}
              >
                <div className="text-sm">{option.label}</div>
                <div className="text-xs opacity-75">{option.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Matches List */}
        <div>
          <h2 className="text-lg font-bold text-primary-300 mb-6">
            Matchs ({currentMatches.length})
          </h2>
          <div className="space-y-4">
            {currentMatches.map((match, idx) => (
              <div key={idx} className="group">
                <ResultCard
                  from={match.from}
                  to={match.to}
                  status={match.status as 'livré' | 'en-cours' | 'retard'}
                  timestamp={match.timestamp}
                />
                <div className="text-xs text-gray-500 mt-2 ml-4">
                  {match.transporter}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Update Notice */}
        <div className="mt-12 bg-blue-900 bg-opacity-30 border border-primary-600 rounded-lg p-4 text-center">
          <div className="text-sm text-primary-300">
            🔄 Cette page se met à jour automatiquement toutes les 30 secondes
          </div>
        </div>
      </main>
    </div>
  );
}
