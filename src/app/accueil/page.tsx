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

  // Mock data
  const trajetsVedettes = [
    {
      icon: '📦',
      title: 'Dakar → Thiès',
      price: '5,000 XOF',
      status: 'Urgent',
      time: 'En cours depuis 2h',
    },
    {
      icon: '🛍️',
      title: 'Saint-Louis → Dakar',
      price: '8,000 XOF',
      status: 'Disponible',
      time: 'Départ demain 9h',
    },
    {
      icon: '📲',
      title: 'Kaolack → Dakar',
      price: '6,500 XOF',
      status: 'Rapide',
      time: '2-3 heures',
    },
    {
      icon: '🎁',
      title: 'Thiès → Dakar',
      price: '4,500 XOF',
      status: 'Flexible',
      time: 'Horaires variables',
    },
  ];

  const topTransporters = [
    { name: 'Samba Express', rating: 4.9, trips: 2340, badge: '🏆 TOP' },
    { name: 'Dakar Logistique', rating: 4.8, trips: 1890, badge: '🚀 Rapide' },
    { name: 'Senegal Delivery', rating: 4.7, trips: 1654, badge: '✓ Fiable' },
    { name: 'Express Sénégal', rating: 4.6, trips: 1432, badge: '📍 Locale' },
  ];

  const articles = [
    {
      id: 1,
      title: 'Afro Sport lance le suivi GPS en temps réel',
      category: 'INNOVATION',
      icon: '⚡',
      timestamp: 'Il y a 1h',
      reads: 5340,
    },
    {
      id: 2,
      title: 'Samba Express devient transporteur #1 du Sénégal',
      category: 'ACTUALITÉS',
      icon: '📰',
      timestamp: 'Il y a 2h',
      reads: 3210,
    },
    {
      id: 3,
      title: 'Jour du transport gratuit : une journée spéciale',
      category: 'ÉVÉNEMENTS',
      icon: '🎉',
      timestamp: 'Il y a 4h',
      reads: 2145,
    },
    {
      id: 4,
      title: '7 conseils pour optimiser vos envois',
      category: 'GUIDES',
      icon: '💡',
      timestamp: 'Il y a 6h',
      reads: 1876,
    },
  ];

  const trajetCarouselItems = trajetsVedettes.map((trajet, idx) => (
    <div key={idx} className="w-80 bg-secondary-800 border border-gray-700 rounded-lg p-6 hover:border-primary-600 transition-all">
      <div className="flex justify-between items-start mb-3">
        <span className="text-3xl">{trajet.icon}</span>
        <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
          {trajet.status}
        </span>
      </div>
      <h3 className="font-bold mb-2">{trajet.title}</h3>
      <div className="text-orange-500 font-bold mb-2">{trajet.price}</div>
      <div className="text-xs text-gray-400">{trajet.time}</div>
    </div>
  ));

  const transporterCarouselItems = topTransporters.map((transporter, idx) => (
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
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-12 text-center">
            <h1 className="text-5xl font-bold mb-4 font-display">
              Suivez vos livraisons en temps réel
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              La plateforme premium de livraison au Sénégal
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-orange-500 text-white px-8 py-3 font-bold rounded hover:bg-orange-600 transition-colors">
                Commencer
              </button>
              <button className="border-2 border-white text-white px-8 py-3 font-bold rounded hover:bg-primary-700 transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
        </section>

        {/* Trajets Vedettes */}
        <Carousel title="🚚 Trajets Vedettes" items={trajetCarouselItems} />

        {/* Top Transporteurs */}
        <Carousel title="⭐ Top Transporteurs" items={transporterCarouselItems} />

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
          <h2 className="text-3xl font-bold mb-4">Prêt à livrer?</h2>
          <p className="text-lg mb-6 text-orange-100">
            Devenez transporteur et gagnez jusqu'à 50,000 XOF/jour
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 font-bold rounded hover:bg-gray-100 transition-colors">
            Rejoindre les transporteurs
          </button>
        </section>
      </main>
    </div>
  );
}
