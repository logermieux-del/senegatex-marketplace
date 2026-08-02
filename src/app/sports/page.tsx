'use client';

import {
  Trophy,
  Target,
  Users,
  Flag,
  Newspaper,
  Zap,
  Calendar,
  Clock,
  Share2,
  Heart,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function SportsHub() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    const newLiked = new Set(liked);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLiked(newLiked);
  };

  const articles = [
    {
      id: 1,
      title: 'Afro Sport : La révolution du transport au Sénégal',
      excerpt:
        'Découvrez comment Afro Sport transforme le secteur de la livraison avec une approche moderne et transparente.',
      category: 'Actualités',
      image: '📰',
      date: '2026-08-02',
      reads: 1240,
    },
    {
      id: 2,
      title: 'Classement des transporteurs : Top 10 du mois',
      excerpt:
        'Les meilleurs performants du mois selon les évaluations des clients. Découvrez qui sont les leaders.',
      category: 'Classements',
      image: '🏆',
      date: '2026-08-01',
      reads: 856,
    },
    {
      id: 3,
      title: 'Nouvelle fonctionnalité : Suivi GPS en temps réel',
      excerpt:
        'Afro Sport lance la fonctionnalité de tracking GPS pour tous les envois. Plus de transparence garantie.',
      category: 'Innovation',
      image: '⚡',
      date: '2026-07-31',
      reads: 2150,
    },
    {
      id: 4,
      title: 'Entrevue : Profil de Samba Express',
      excerpt:
        'Rencontre avec le transporteur le plus noté de la plateforme. Son secret ? L\'écoute du client.',
      category: 'Profils',
      image: '👤',
      date: '2026-07-30',
      reads: 645,
    },
    {
      id: 5,
      title: 'Événement : Jour du transport gratuit',
      excerpt:
        'Afro Sport organise une journée spéciale avec livraisons à prix réduit. Ne manquez pas cette opportunité !',
      category: 'Événements',
      image: '🎉',
      date: '2026-07-29',
      reads: 1876,
    },
    {
      id: 6,
      title: 'Conseils : Comment optimiser vos envois',
      excerpt:
        'Guide complet pour envoyer vos colis de manière efficace et économique. Tous nos tips en un article.',
      category: 'Guides',
      image: '💡',
      date: '2026-07-28',
      reads: 934,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Dakar → Thiès',
      time: '14:30',
      date: 'Aujourd\'hui',
      icon: Target,
      available: true,
    },
    {
      id: 2,
      title: 'Saint-Louis → Dakar',
      time: '09:00',
      date: 'Demain',
      icon: Clock,
      available: true,
    },
    {
      id: 3,
      title: 'Kaolack → Dakar',
      time: '11:15',
      date: 'Demain',
      icon: Calendar,
      available: false,
    },
  ];

  const recentResults = [
    { id: 1, from: 'Dakar', to: 'Thiès', status: 'Livré', time: 'Il y a 2h' },
    { id: 2, from: 'Saint-Louis', to: 'Dakar', status: 'En cours', time: 'Il y a 45min' },
    { id: 3, from: 'Kaolack', to: 'Dakar', status: 'Livré', time: 'Il y a 5h' },
  ];

  const topTransporters = [
    { name: 'Samba Express', rating: 4.9, trips: 2340, badge: 'Top Transporteur' },
    { name: 'Dakar Logistique', rating: 4.8, trips: 1890, badge: 'Rapide' },
    { name: 'Senegal Delivery', rating: 4.7, trips: 1654, badge: 'Fiable' },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-black">Afro Sport</span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex gap-8">
              {['Accueil', 'Actualités', 'Résultats', 'Classements', 'Équipes'].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-black hover:text-blue-600 font-medium transition-colors"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <nav className="md:hidden flex flex-col gap-4 mt-4 pt-4 border-t">
              {['Accueil', 'Actualités', 'Résultats', 'Classements', 'Équipes'].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-black hover:text-blue-600 font-medium"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Suivez Vos Livraisons
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            L'actualité du transport en temps réel. Tous les résultats, classements et événements au Sénégal.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 font-bold hover:bg-gray-100 transition-colors border-2 border-black">
            Commencer →
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-2">
              <Newspaper className="w-8 h-8 text-blue-600" />
              Actualités Récentes
            </h2>
            <div className="h-1 w-16 bg-blue-600 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Article Image */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-40 flex items-center justify-center text-6xl">
                    {article.image}
                  </div>

                  {/* Article Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm">{article.date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        {article.reads.toLocaleString()} lectures
                      </span>
                      <button
                        onClick={() => toggleLike(article.id)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            liked.has(article.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-blue-600'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                À Venir
              </h3>
              <div className="h-1 w-12 bg-blue-600 mb-4" />

              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const IconComponent = event.icon;
                  return (
                    <div
                      key={event.id}
                      className="border-l-4 border-blue-600 pl-4 py-2"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-black">
                          {event.title}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time} - {event.date}
                      </div>
                      <div
                        className={`mt-1 text-xs font-bold ${
                          event.available ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      >
                        {event.available ? '✓ Disponible' : '✗ Complet'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black mb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Résultats Récents
              </h3>
              <div className="h-1 w-12 bg-blue-600 mb-4" />

              <div className="space-y-3">
                {recentResults.map((result) => (
                  <div key={result.id} className="border-b border-gray-200 pb-3">
                    <div className="text-sm font-bold text-black">
                      {result.from} → {result.to}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-xs font-bold px-2 py-1 ${
                          result.status === 'Livré'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {result.status}
                      </span>
                      <span className="text-xs text-gray-500">{result.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Transporters */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Top Transporteurs
              </h3>
              <div className="h-1 w-12 bg-white mb-4" />

              <div className="space-y-3">
                {topTransporters.map((transporter, idx) => (
                  <div key={idx} className="bg-blue-500 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-lg">#{idx + 1}</span>
                      <span className="text-sm bg-white text-blue-600 px-2 py-1 font-bold rounded">
                        {transporter.rating} ⭐
                      </span>
                    </div>
                    <div className="text-sm font-bold">{transporter.name}</div>
                    <div className="text-xs text-blue-100 mt-1">
                      {transporter.trips.toLocaleString()} trajets
                    </div>
                    <div className="text-xs bg-blue-400 text-white px-2 py-1 rounded mt-2 inline-block">
                      {transporter.badge}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Statistiques Plateforme
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Utilisateurs Actifs', value: '1,234+', icon: Users },
              { label: 'Livraisons', value: '5,678+', icon: Zap },
              { label: 'Villes Couvertes', value: '18', icon: Flag },
              { label: 'Satisfaction', value: '4.8/5', icon: Trophy },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border-2 border-blue-600 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-3">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-700 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-black text-center mb-2">
            Comment Ça Marche
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Cherchez', desc: 'Trouvez un transporteur', icon: '🔍' },
              { step: 2, title: 'Détails', desc: 'Entrez vos informations', icon: '📋' },
              { step: 3, title: 'Paiement', desc: 'Paiement sécurisé', icon: '💳' },
              { step: 4, title: 'Suivi', desc: 'GPS en temps réel', icon: '📍' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-black mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à rejoindre Afro Sport?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Devenez transporteur ou utilisateur dès aujourd'hui
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 font-bold hover:bg-gray-100 transition-colors">
              S'inscrire
            </button>
            <button className="border-2 border-white text-white px-8 py-3 font-bold hover:bg-blue-700 transition-colors">
              En Savoir Plus
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5" /> Afro Sport
              </h4>
              <p className="text-gray-400">
                La plateforme premium de livraison au Sénégal
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Aide</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Réseaux Sociaux</h4>
              <div className="flex gap-3">
                {[Share2, Heart].map((Icon, idx) => (
                  <button
                    key={idx}
                    className="hover:text-blue-400 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2026 Afro Sport. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
