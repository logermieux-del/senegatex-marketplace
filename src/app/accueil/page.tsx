'use client';

import Navigation from '@/components/Navigation';
import Carousel from '@/components/Carousel';
import { TransporterCard, ArticleCard, ResultCard } from '@/components/Cards';
import { useState } from 'react';

export default function Accueil() {
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

  // Mock data - Sports focused
  const matchesVedettes = [
    {
      icon: '⚽',
      title: 'Dakar vs Saint-Louis',
      status: 'EN DIRECT',
      score: '2-1',
      time: '75\'',
    },
    {
      icon: '🏀',
      title: 'Thiès Basketball Challenge',
      status: 'TERMINÉ',
      score: '98-95',
      time: 'Fibal',
    },
    {
      icon: '🏐',
      title: 'Championnat Volley Dakar',
      status: 'À VENIR',
      score: 'vs',
      time: 'Demain 19h',
    },
    {
      icon: '🎾',
      title: 'Tournoi Tennis Kaolack',
      status: 'EN DIRECT',
      score: '6-4',
      time: '2ème set',
    },
  ];

  const topAthletes = [
    { name: 'Mamadou Ndiaye', rating: 4.9, trips: 234, badge: '⚽ Attaque' },
    { name: 'Ousmane Sall', rating: 4.8, trips: 198, badge: '🏀 Star' },
    { name: 'Aïssatou Diouf', rating: 4.7, trips: 187, badge: '🏐 Leader' },
    { name: 'Cheikh Fall', rating: 4.6, trips: 176, badge: '🎾 Champion' },
  ];

  const articles = [
    {
      id: 1,
      title: 'Dakar Football Club remporte le championnat national',
      category: 'FOOTBALL',
      icon: '⚽',
      timestamp: 'Il y a 1h',
      reads: 5340,
    },
    {
      id: 2,
      title: 'Thiès Basketball: nouvelle venue aux Jeux Africains',
      category: 'BASKETBALL',
      icon: '🏀',
      timestamp: 'Il y a 2h',
      reads: 3210,
    },
    {
      id: 3,
      title: 'Tournoi International de Volley à Dakar cette semaine',
      category: 'ÉVÉNEMENTS',
      icon: '🎉',
      timestamp: 'Il y a 4h',
      reads: 2145,
    },
    {
      id: 4,
      title: '10 conseils pour préparer votre entraînement sportif',
      category: 'COACHING',
      icon: '💪',
      timestamp: 'Il y a 6h',
      reads: 1876,
    },
  ];

  const matchCarouselItems = matchesVedettes.map((match, idx) => (
    <div key={idx} className="w-80 bg-secondary-800 border border-gray-700 rounded-lg p-6 hover:border-primary-600 transition-all">
      <div className="flex justify-between items-start mb-3">
        <span className="text-3xl">{match.icon}</span>
        <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
          {match.status}
        </span>
      </div>
      <h3 className="font-bold mb-2">{match.title}</h3>
      <div className="text-orange-500 font-bold text-2xl mb-2">{match.score}</div>
      <div className="text-xs text-gray-400">{match.time}</div>
    </div>
  ));

  const athleteCarouselItems = topAthletes.map((athlete, idx) => (
    <TransporterCard
      key={idx}
      name={athlete.name}
      rating={athlete.rating}
      trips={athlete.trips}
      badge={athlete.badge}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-primary-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-12 text-center">
            <h1 className="text-5xl font-bold mb-4 font-display">
              Suivez le sport en temps réel
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              La plateforme premium du sport africain
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-orange-500 text-white px-8 py-3 font-bold rounded hover:bg-orange-600 transition-colors">
                Regarder en Direct
              </button>
              <button className="border-2 border-white text-white px-8 py-3 font-bold rounded hover:bg-primary-700 transition-colors">
                Calendrier
              </button>
            </div>
          </div>
        </section>

        {/* Matches Vedettes */}
        <Carousel title="🔥 Matchs en Direct" items={matchCarouselItems} />

        {/* Top Athletes */}
        <Carousel title="⭐ Top Athlètes" items={athleteCarouselItems} />

        {/* Articles */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-primary-300 mb-4">🔥 En Tendance</h2>
          <div className="space-y-4">
            {articles.map((article) => (
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à jouer?</h2>
          <p className="text-lg mb-6 text-orange-100">
            Rejoignez notre communauté de plus de 50 000 athlètes et supporters
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 font-bold rounded hover:bg-gray-100 transition-colors">
            S'inscrire maintenant
          </button>
        </section>
      </main>
    </div>
  );
}
