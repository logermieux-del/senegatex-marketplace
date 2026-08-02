'use client';

import Navigation from '@/components/Navigation';
import { TransporterCard, ArticleCard } from '@/components/Cards';
import Carousel from '@/components/Carousel';
import { useState } from 'react';

export default function PourVous() {
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedArticles);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedArticles(newLiked);
  };

  const favoriteTransporters = [
    { name: 'Samba Express', rating: 4.9, trips: 2340, badge: '🏆 TOP' },
    { name: 'Dakar Logistique', rating: 4.8, trips: 1890, badge: '🚀 Rapide' },
    { name: 'Senegal Delivery', rating: 4.7, trips: 1654, badge: '✓ Fiable' },
  ];

  const myTrips = [
    {
      id: 1,
      from: 'Dakar',
      to: 'Thiès',
      transporter: 'Samba Express',
      progress: 65,
      eta: 'Arrivée prévue à 14h30',
      distance: '65km',
    },
    {
      id: 2,
      from: 'Kaolack',
      to: 'Dakar',
      transporter: 'Dakar Logistique',
      progress: 40,
      eta: 'Arrivée prévue demain 11h',
      distance: '195km',
    },
    {
      id: 3,
      from: 'Saint-Louis',
      to: 'Dakar',
      transporter: 'Express Sénégal',
      progress: 80,
      eta: 'Arrivée prévue à 16h00',
      distance: '265km',
    },
  ];

  const recommendedArticles = [
    {
      id: 1,
      title: 'Comment maximiser vos économies de livraison?',
      category: 'GUIDES',
      icon: '💰',
      timestamp: 'Il y a 2h',
      reads: 1240,
    },
    {
      id: 2,
      title: 'Nouveau service express 24/24 lancé cette semaine',
      category: 'INNOVATION',
      icon: '⚡',
      timestamp: 'Il y a 3h',
      reads: 2156,
    },
    {
      id: 3,
      title: 'Interview : Les secrets des meilleurs transporteurs',
      category: 'ACTUALITÉS',
      icon: '🎤',
      timestamp: 'Il y a 5h',
      reads: 3421,
    },
    {
      id: 4,
      title: 'Forum communautaire : Vos questions aux experts',
      category: 'GUIDES',
      icon: '💬',
      timestamp: 'Il y a 6h',
      reads: 1876,
    },
  ];

  const transporterCarouselItems = favoriteTransporters.map((transporter, idx) => (
    <TransporterCard
      key={idx}
      name={transporter.name}
      rating={transporter.rating}
      trips={transporter.trips}
      badge={transporter.badge}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-black text-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-display">Pour Vous</h1>
          <p className="text-gray-400">Suivi personnalisé, favoris et recommandations</p>
        </div>

        {/* Mes Favoris */}
        <Carousel title="⭐ Mes Transporteurs Favoris" items={transporterCarouselItems} />

        {/* Mes Trajets en Cours */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-primary-300 mb-6">🚀 Mes Trajets en Cours</h2>
          <div className="space-y-6">
            {myTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-secondary-800 border border-gray-700 rounded-lg p-6 hover:border-primary-600 transition-all"
              >
                {/* Trip Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">{trip.from} → {trip.to}</div>
                    <div className="font-bold text-lg mb-1">{trip.transporter}</div>
                    <div className="text-xs text-primary-300">{trip.distance}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-500">{trip.progress}%</div>
                    <div className="text-xs text-gray-400 mt-1">{trip.eta}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-secondary-700 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-orange-500 h-full transition-all duration-300"
                    style={{ width: `${trip.progress}%` }}
                  />
                </div>

                {/* Status */}
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>📍 En cours</span>
                  <span>⏱️ Mise à jour: Il y a 30s</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommandé pour Vous */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-primary-300 mb-6">💡 Recommandé pour Vous</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                category={article.category}
                icon={article.icon}
                timestamp={article.timestamp}
                reads={article.reads}
                isLiked={likedArticles.has(article.id)}
                onLike={() => toggleLike(article.id)}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold mb-2">3</div>
            <div className="text-primary-100">Trajets actifs</div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold mb-2">12</div>
            <div className="text-orange-100">Transporteurs suivis</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold mb-2">47</div>
            <div className="text-green-100">Trajets complétés</div>
          </div>
        </div>
      </main>
    </div>
  );
}
