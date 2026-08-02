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

  const livraisons = {
    today: [
      { from: 'Dakar', to: 'Thiès', status: 'en-cours', timestamp: 'Il y a 2h', transporter: 'Samba Express' },
      { from: 'Saint-Louis', to: 'Dakar', status: 'livré', timestamp: 'Il y a 4h', transporter: 'Dakar Logistique' },
      { from: 'Kaolack', to: 'Dakar', status: 'retard', timestamp: 'Il y a 1h', transporter: 'Express Sénégal' },
      { from: 'Thiès', to: 'Dakar', status: 'en-cours', timestamp: 'Il y a 30min', transporter: 'Senegal Delivery' },
    ],
    tomorrow: [
      { from: 'Dakar', to: 'Thiès', status: 'livré', timestamp: '09:30', transporter: 'Samba Express' },
      { from: 'Kaolack', to: 'Dakar', status: 'livré', timestamp: '14:15', transporter: 'Dakar Logistique' },
      { from: 'Saint-Louis', to: 'Dakar', status: 'en-cours', timestamp: '16:45', transporter: 'Senegal Delivery' },
    ],
    saturday: [
      { from: 'Dakar', to: 'Saint-Louis', status: 'en-cours', timestamp: '08:00', transporter: 'Samba Express' },
      { from: 'Thiès', to: 'Kaolack', status: 'en-cours', timestamp: '11:20', transporter: 'Express Sénégal' },
    ],
    sunday: [
      { from: 'Dakar', to: 'Thiès', status: 'en-cours', timestamp: '10:00', transporter: 'Dakar Logistique' },
    ],
  };

  const stats = {
    today: { total: 4, livred: 1, enCours: 2, retard: 1 },
    tomorrow: { total: 3, livred: 2, enCours: 1, retard: 0 },
    saturday: { total: 2, livred: 0, enCours: 2, retard: 0 },
    sunday: { total: 1, livred: 0, enCours: 1, retard: 0 },
  };

  const currentLivraisons =
    livraisons[selectedDate as keyof typeof livraisons] || livraisons.today;
  const currentStats =
    stats[selectedDate as keyof typeof stats] || stats.today;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-black text-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-display">Scores en Direct</h1>
          <p className="text-gray-400">Suivez tous les trajets de livraison en temps réel</p>
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
            <div className="text-sm text-gray-400">Livrés</div>
          </div>
          <div className="bg-secondary-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {currentStats.enCours}
            </div>
            <div className="text-sm text-gray-400">En cours</div>
          </div>
          <div className="bg-secondary-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {currentStats.retard}
            </div>
            <div className="text-sm text-gray-400">Retards</div>
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

        {/* Livraisons List */}
        <div>
          <h2 className="text-lg font-bold text-primary-300 mb-6">
            Livraisons ({currentLivraisons.length})
          </h2>
          <div className="space-y-4">
            {currentLivraisons.map((livraison, idx) => (
              <div key={idx} className="group">
                <ResultCard
                  from={livraison.from}
                  to={livraison.to}
                  status={livraison.status as 'livré' | 'en-cours' | 'retard'}
                  timestamp={livraison.timestamp}
                />
                <div className="text-xs text-gray-500 mt-2 ml-4">
                  Transporteur: {livraison.transporter}
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
