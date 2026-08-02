'use client';

import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="bg-white border-b border-secondary-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="font-display text-3xl font-bold text-primary-600">
            Afro Sport
          </div>
          <div className="flex gap-3 sm:gap-4">
            <a
              href="/login"
              className="text-secondary-600 hover:text-primary-600 transition-colors text-sm sm:text-base"
            >
              Connexion
            </a>
            <a
              href="/signup"
              className="bg-primary-600 text-white px-4 py-2 text-sm sm:text-base hover:bg-primary-700 transition-colors"
            >
              S&apos;inscrire
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-accent-500 h-80 rounded-lg flex items-center justify-center">
                <span className="text-6xl">🚚</span>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                Livraison Rapide au Sénégal
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 mb-8">
                Connectez-vous avec les meilleurs transporteurs pour vos envois locaux. Rapide, fiable, transparent.
              </p>
              <div className="flex gap-4">
                <button className="bg-accent-500 text-white px-6 py-3 font-bold hover:bg-accent-600 transition-colors">
                  Commencer
                </button>
                <button className="border-2 border-white text-white px-6 py-3 font-bold hover:bg-primary-700 transition-colors">
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-primary-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cherchez une livraison, un transporteur..."
              data-testid="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-secondary-300 text-secondary-900 placeholder-secondary-500"
            />
            <button className="bg-accent-500 text-white px-6 py-3 font-bold hover:bg-accent-600 transition-colors">
              Chercher
            </button>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-secondary-900 mb-2">
              Livraisons en Tendance
            </h2>
            <div className="h-1 w-16 bg-accent-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📦', title: 'Dakar → Thiès', price: '5,000 XOF', status: 'Disponible' },
              { icon: '🛍️', title: 'Saint-Louis → Dakar', price: '8,000 XOF', status: 'Urgent' },
              { icon: '🏪', title: 'Kaolack → Dakar', price: '6,500 XOF', status: 'Disponible' },
              { icon: '📲', title: 'Dakar → Sénégal', price: 'À partir de 4,000 XOF', status: 'Flexible' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-secondary-50 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-secondary-900">{item.title}</h3>
                <p className="text-accent-600 font-bold mb-3">{item.price}</p>
                <div className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1">
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-primary-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Utilisateurs Actifs', value: '1,234+', color: 'primary' },
              { label: 'Livraisons', value: '5,678+', color: 'accent' },
              { label: 'Villes Couvertes', value: '18', color: 'secondary' },
              { label: 'Satisfaction', value: '4.8/5', color: 'primary' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className={`text-5xl font-bold mb-2 text-${stat.color}-600`}>
                  {stat.value}
                </p>
                <p className="text-secondary-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-secondary-900 mb-2">
              Comment Ça Marche
            </h2>
            <div className="h-1 w-16 bg-accent-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: '🔍', title: 'Cherchez', desc: 'Trouvez un transporteur disponible' },
              { step: '2', icon: '📋', title: 'Détails', desc: 'Entrez les informations d\'envoi' },
              { step: '3', icon: '💳', title: 'Paiement', desc: 'Paiement sécurisé et flexible' },
              { step: '4', icon: '✓', title: 'Livraison', desc: 'Suivi en temps réel GPS' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-secondary-900">{item.title}</h3>
                <p className="text-secondary-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Transporters */}
      <section className="bg-secondary-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-secondary-900 mb-2">
              Transporteurs Populaires
            </h2>
            <div className="h-1 w-16 bg-accent-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Samba Express', rating: '4.9', trips: '2,340 trajets', badge: '⭐ Top Transporteur' },
              { name: 'Dakar Logistique', rating: '4.8', trips: '1,890 trajets', badge: '🚀 Rapide' },
              { name: 'Senegal Delivery', rating: '4.7', trips: '1,654 trajets', badge: '✓ Fiable' },
            ].map((transporter, i) => (
              <div key={i} className="bg-white p-8 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="bg-primary-600 w-20 h-20 rounded-full mb-4 flex items-center justify-center text-3xl">
                  👤
                </div>
                <h3 className="font-bold text-lg mb-2 text-secondary-900">{transporter.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent-500 font-bold">{transporter.rating}</span>
                  <span className="text-secondary-600">({transporter.trips})</span>
                </div>
                <div className="inline-block bg-accent-100 text-accent-700 text-xs font-bold px-3 py-1">
                  {transporter.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent-500 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Prêt à commencer votre première livraison?
          </h2>
          <p className="text-lg mb-8 text-accent-100">
            Rejoignez des milliers d'utilisateurs qui font confiance à Afro Sport
          </p>
          <button className="bg-white text-accent-600 px-8 py-4 font-bold text-lg hover:bg-secondary-50 transition-colors">
            S'inscrire Gratuitement
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Afro Sport</h4>
              <p className="text-secondary-400">
                Plateforme de livraison locale au Sénégal
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white">Tarifs</a></li>
                <li><a href="#" className="hover:text-white">Sécurité</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Aide</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white">Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-700 pt-8 text-center text-secondary-400">
            <p>© 2026 Afro Sport. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
