'use client';

import Navigation from '@/components/Navigation';
import { ArticleCard } from '@/components/Cards';
import { useState } from 'react';

export default function Actualites() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());

  const categories = ['all', 'actualites', 'innovation', 'evenements', 'guides', 'transferts'];

  const articles = [
    {
      id: 1,
      title: 'Afro Sport lance le suivi GPS en temps réel pour toutes les livraisons',
      category: 'INNOVATION',
      icon: '⚡',
      timestamp: 'Il y a 1h',
      reads: 5340,
      featured: true,
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
      title: 'Jour du transport gratuit : une journée spéciale Afro Sport',
      category: 'ÉVÉNEMENTS',
      icon: '🎉',
      timestamp: 'Il y a 4h',
      reads: 2145,
    },
    {
      id: 4,
      title: '7 conseils pour optimiser vos envois et économiser',
      category: 'GUIDES',
      icon: '💡',
      timestamp: 'Il y a 6h',
      reads: 1876,
    },
    {
      id: 5,
      title: 'Transferts: 3 nouveaux transporteurs rejoignent la plateforme',
      category: 'TRANSFERTS',
      icon: '📌',
      timestamp: 'Il y a 8h',
      reads: 1654,
    },
    {
      id: 6,
      title: 'Nouveau partenariat avec DHL Express',
      category: 'ACTUALITÉS',
      icon: '🤝',
      timestamp: 'Il y a 10h',
      reads: 2876,
    },
    {
      id: 7,
      title: 'Application mobile Afro Sport: les 5 nouvelles fonctionnalités',
      category: 'INNOVATION',
      icon: '📱',
      timestamp: 'Il y a 12h',
      reads: 4123,
    },
    {
      id: 8,
      title: 'Conférence: "Le futur de la livraison en Afrique"',
      category: 'ÉVÉNEMENTS',
      icon: '🎤',
      timestamp: 'Il y a 14h',
      reads: 1432,
    },
  ];

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedArticles);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedArticles(newLiked);
  };

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category.toLowerCase() === selectedCategory);

  const featuredArticle = articles.find((a) => a.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-black text-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-display">Actualités</h1>
          <p className="text-gray-400">Les dernières infos sur Afro Sport et la livraison au Sénégal</p>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-primary-300 mb-4">🔥 À LA UNE</h2>
            <div className="bg-gradient-to-r from-primary-600 to-orange-500 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                <div className="flex items-center justify-center text-7xl">
                  {featuredArticle.icon}
                </div>
                <div className="md:col-span-2">
                  <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded inline-block mb-4">
                    {featuredArticle.category}
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{featuredArticle.title}</h3>
                  <div className="flex gap-6 text-sm">
                    <span>{featuredArticle.timestamp}</span>
                    <span>{featuredArticle.reads.toLocaleString()} lectures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-primary-300 mb-4">Filtrer par catégorie</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-800 border border-gray-700 text-gray-400 hover:border-primary-600'
                }`}
              >
                {category === 'all'
                  ? 'Tous'
                  : category === 'actualites'
                    ? 'Actualités'
                    : category === 'innovation'
                      ? 'Innovation'
                      : category === 'evenements'
                        ? 'Événements'
                        : category === 'guides'
                          ? 'Guides'
                          : 'Transferts'}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-primary-300 mb-6">
            Articles ({filteredArticles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
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

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">📬 Recevez les actualités</h2>
          <p className="text-primary-100 mb-6">
            Abonnez-vous à notre newsletter pour ne rien manquer
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email..."
              className="flex-1 px-4 py-3 rounded text-black"
            />
            <button className="bg-orange-500 text-white px-6 py-3 rounded font-bold hover:bg-orange-600 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
