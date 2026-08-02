'use client';

import Navigation from '@/components/Navigation';
import { useState } from 'react';
import { Activity, TrendingUp, Trophy, Zap, Heart } from 'lucide-react';

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

  const liveMatches = [
    { id: 1, sport: 'Football', teams: 'Dakar FC vs Thiès United', score: '2-1', time: '75\'', status: 'EN DIRECT' },
    { id: 2, sport: 'Basketball', teams: 'ASC Dakar vs SEIC', score: '98-95', time: 'Final', status: 'TERMINÉ' },
    { id: 3, sport: 'Volley-ball', teams: 'Championnat National', score: 'vs', time: 'Demain 19h', status: 'À VENIR' },
    { id: 4, sport: 'Lutte', teams: 'Combat Premium Dakar', score: 'Exhibition', time: 'Samedi', status: 'À VENIR' },
  ];

  const topPlayers = [
    { name: 'Mamadou Ndiaye', sport: 'Football', rating: 4.9, matches: 234 },
    { name: 'Ousmane Sall', sport: 'Basketball', rating: 4.8, matches: 198 },
    { name: 'Aïssatou Diouf', sport: 'Volley', rating: 4.7, matches: 187 },
    { name: 'Cheikh Fall', sport: 'Tennis', rating: 4.6, matches: 176 },
  ];

  const articles = [
    { id: 1, title: 'Dakar FC remporte le championnat national', category: 'FOOTBALL', timestamp: 'Il y a 1h', reads: 5340 },
    { id: 2, title: 'Nouvelle ère pour le basketball sénégalais', category: 'BASKETBALL', timestamp: 'Il y a 2h', reads: 3210 },
    { id: 3, title: 'Tournoi international de volley en direct de Dakar', category: 'ÉVÉNEMENTS', timestamp: 'Il y a 4h', reads: 2145 },
    { id: 4, title: 'Les secrets d\'entraînement des champions africains', category: 'COACHING', timestamp: 'Il y a 6h', reads: 1876 },
  ];

  return (
    <div className="min-h-screen bg-secondary-900 text-primary-100">
      <Navigation />

      <main>
        {/* Premium Hero Section with Arena Background */}
        <section className="hero-section relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* B&W Arena Background Effect */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <filter id="grain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                </filter>
              </defs>
              <rect width="1000" height="600" fill="#0a0908" />
              {/* Arena seats pattern */}
              <circle cx="500" cy="300" r="250" fill="none" stroke="#48516b" strokeWidth="2" opacity="0.3" />
              <circle cx="500" cy="300" r="200" fill="none" stroke="#48516b" strokeWidth="1" opacity="0.2" />
              <circle cx="500" cy="300" r="150" fill="none" stroke="#48516b" strokeWidth="1" opacity="0.15" />
              {/* Field markings */}
              <rect x="250" y="200" width="500" height="200" fill="none" stroke="#48516b" strokeWidth="1" opacity="0.2" />
              <line x1="500" y1="200" x2="500" y2="400" stroke="#48516b" strokeWidth="1" opacity="0.2" />
            </svg>
          </div>

          <div className="hero-overlay"></div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-4xl px-4">
            <div className="accent-bar mb-8 w-24 mx-auto rounded-full"></div>
            <h1 className="font-serif text-6xl md:text-7xl font-bold mb-6 text-white">
              Afro <span className="text-blue-500">Sport</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-4 font-light tracking-wide">
              La Plateforme Premium du Sport Africain
            </p>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Suivez tous les matchs en direct, classements, actualités et performances des meilleures athlètes du continent.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="btn-blue">
                Regarder en Direct
              </button>
              <button className="btn-bronze">
                Explorer les Scores
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-secondary-800 py-16 relative">
          <div className="accent-bar mb-0"></div>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="stat-box">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Athlètes Inscrits</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Matchs par Mois</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Couverture Premium</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">5</div>
                <div className="stat-label">Sports Majeurs</div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Matches Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-blue-500" />
              <h2 className="font-serif text-4xl font-bold text-white">Matchs en Direct</h2>
            </div>
            <div className="accent-bar w-20 mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {liveMatches.map((match) => (
              <div key={match.id} className="card-premium group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">{match.sport}</p>
                    <h3 className="text-xl font-bold mt-2 text-white">{match.teams}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                    match.status === 'EN DIRECT' ? 'bg-blue-500/20 text-blue-300' :
                    match.status === 'TERMINÉ' ? 'bg-primary-400/20 text-primary-300' :
                    'bg-secondary-700 text-primary-400'
                  }`}>
                    {match.status}
                  </span>
                </div>
                <div className="border-t border-secondary-600 pt-4">
                  <div className="text-4xl font-bold text-blue-500 font-display mb-2">{match.score}</div>
                  <p className="text-primary-400 text-sm">{match.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Players Section */}
        <section className="bg-secondary-800 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-blue-400" />
                <h2 className="font-serif text-4xl font-bold text-white">Top Athlètes</h2>
              </div>
              <div className="accent-bar w-20 mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPlayers.map((player, idx) => (
                <div key={idx} className="card-premium">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mx-auto mb-4 flex items-center justify-center">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-white">{player.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{player.sport}</p>
                    <div className="flex justify-around pt-4 border-t border-secondary-600">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-500">{player.rating}</p>
                        <p className="text-xs text-gray-400">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{player.matches}</p>
                        <p className="text-xs text-gray-400">Matchs</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <h2 className="font-serif text-4xl font-bold text-white">En Tendance</h2>
            </div>
            <div className="accent-bar w-20 mt-4"></div>
          </div>

          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="card-premium hover:bg-secondary-700/50">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">{article.category}</p>
                    <h3 className="text-xl font-bold mb-3 text-white">{article.title}</h3>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span>{article.timestamp}</span>
                      <span>•</span>
                      <span>{article.reads.toLocaleString()} lectures</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLike(article.id)}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-700 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${likedArticles.has(article.id) ? 'fill-accent-500 text-accent-500' : 'text-primary-400'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-t-4 border-blue-500 py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="font-serif text-5xl font-bold mb-6 text-white">
              Rejoignez la Communauté Premium
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Accès exclusif aux analyses détaillées, notifications en direct, et contenu premium des meilleures athlètes africaines.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="btn-blue text-lg">
                S'inscrire Gratuitement
              </button>
              <button className="btn-bronze text-lg">
                Découvrir Plus
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
