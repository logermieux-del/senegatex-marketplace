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

  const favoriteTeams = [
    { name: 'Dakar FC', rating: 4.9, trips: 23, badge: '⚽ Champion' },
    { name: 'Basket Dakar', rating: 4.8, trips: 20, badge: '🏀 Leader' },
    { name: 'Volley Dakar', rating: 4.7, trips: 21, badge: '🏐 Fort' },
  ];

  const myMatches = [
    {
      id: 1,
      from: 'Dakar FC',
      to: 'Saint-Louis',
      transporter: 'Football - Ligue 1',
      progress: 65,
      eta: 'Reprise à la 75\' minute',
      distance: '2-1',
    },
    {
      id: 2,
      from: 'Basket Dakar',
      to: 'Thiès Basketball',
      transporter: 'Basketball - D1',
      progress: 40,
      eta: 'Début: Demain 19h',
      distance: 'À venir',
    },
    {
      id: 3,
      from: 'Volley Dakar',
      to: 'ASC Sénégal',
      transporter: 'Volley - National',
      progress: 80,
      eta: 'Match terminé',
      distance: '3-0',
    },
  ];

  const recommendedArticles = [
    {
      id: 1,
      title: 'Comment devenir un meilleur fan: 5 conseils essentiels',
      category: 'GUIDES',
      icon: '🎯',
      timestamp: 'Il y a 2h',
      reads: 1240,
    },
    {
      id: 2,
      title: 'Nouvelle retransmission 4K lancée pour tous les matchs',
      category: 'TECHNOLOGIE',
      icon: '📺',
      timestamp: 'Il y a 3h',
      reads: 2156,
    },
    {
      id: 3,
      title: 'Interview : Comment Dakar FC a remporté le titre',
      category: 'INTERVIEWS',
      icon: '🎤',
      timestamp: 'Il y a 5h',
      reads: 3421,
    },
    {
      id: 4,
      title: 'Communauté des fans: Partagez votre passion',
      category: 'COMMUNAUTÉ',
      icon: '👥',
      timestamp: 'Il y a 6h',
      reads: 1876,
    },
  ];

  const teamCarouselItems = favoriteTeams.map((team, idx) => (
    <TransporterCard
      key={idx}
      name={team.name}
      rating={team.rating}
      trips={team.trips}
      badge={team.badge}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-black text-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-display">Pour Vous</h1>
          <p className="text-gray-400">Votre suivi sportif personnalisé, équipes favoris et matchs recommandés</p>
        </div>

        {/* Mes Équipes Favorites */}
        <Carousel title="⭐ Mes Équipes Favorites" items={teamCarouselItems} />

        {/* Mes Matchs Suivis */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-primary-300 mb-6">🏆 Mes Matchs Suivis</h2>
          <div className="space-y-6">
            {myMatches.map((match) => (
              <div
                key={match.id}
                className="bg-secondary-800 border border-gray-700 rounded-lg p-6 hover:border-primary-600 transition-all"
              >
                {/* Match Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">{match.from} vs {match.to}</div>
                    <div className="font-bold text-lg mb-1">{match.transporter}</div>
                    <div className="text-xs text-primary-300">Score: {match.distance}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-500">{match.progress}%</div>
                    <div className="text-xs text-gray-400 mt-1">{match.eta}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-secondary-700 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-orange-500 h-full transition-all duration-300"
                    style={{ width: `${match.progress}%` }}
                  />
                </div>

                {/* Status */}
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>⚽ Match suivi</span>
                  <span>📊 Progression du match</span>
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
            <div className="text-primary-100">Matchs suivis</div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold mb-2">8</div>
            <div className="text-orange-100">Équipes favorites</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold mb-2">156</div>
            <div className="text-green-100">Matchs regardés</div>
          </div>
        </div>
      </main>
    </div>
  );
}
