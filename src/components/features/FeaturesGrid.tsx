'use client';

import {
  AstronautIcon,
  SatelliteIcon,
  TelescopeIcon,
  RocketIcon,
  UFOIcon,
  PlanetIcon,
  AlienIcon,
} from '@/components/icons/CategoryIcons';

interface Feature {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType;
}

const features: Feature[] = [
  {
    id: 'astronaut',
    label: 'Vendeurs de Confiance',
    description: 'Des vendeurs vérifiés et fiables',
    icon: AstronautIcon,
  },
  {
    id: 'satellite',
    label: 'Livraison Rapide',
    description: 'Partout au Sénégal',
    icon: SatelliteIcon,
  },
  {
    id: 'telescope',
    label: 'Produits Vérifiés',
    description: 'Qualité garantie',
    icon: TelescopeIcon,
  },
  {
    id: 'rocket',
    label: 'Service Rapide',
    description: 'Réponse instantanée',
    icon: RocketIcon,
  },
  {
    id: 'ufo',
    label: 'Technologie Innovante',
    description: 'Plateforme moderne',
    icon: UFOIcon,
  },
  {
    id: 'planet',
    label: 'Communauté Locale',
    description: 'Connectez-vous localement',
    icon: PlanetIcon,
  },
  {
    id: 'alien',
    label: 'Support Unique',
    description: 'Assistance 24/7',
    icon: AlienIcon,
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-500 mb-4 font-display">
            Pourquoi Yombal?
          </h2>
          <p className="text-accent-600 max-w-2xl mx-auto">
            Une plateforme révolutionnaire pour acheter et vendre localement au Sénégal
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group flex flex-col items-center text-center p-6 rounded-xl bg-white border border-accent-200 hover:border-primary-300 hover:shadow-lg transition-all"
              >
                <div className="mb-4 text-primary-500 group-hover:text-primary-600 transition-colors">
                  <Icon />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2 font-sans">
                  {feature.label}
                </h3>
                <p className="text-sm text-accent-600 font-sans">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
