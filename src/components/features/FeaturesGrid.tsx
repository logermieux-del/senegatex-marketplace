'use client';

import { IconBadge } from '@/components/icons/IconBadge';
import {
  AstronautIcon,
  SpaceshipIcon,
  TelescopeIcon,
  RocketIcon,
  UFOIcon,
  PlanetIcon,
  AlienIcon,
  SatelliteDishIcon,
} from '@/components/icons/CategoryIcons';

interface Feature {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'accent';
}

const features: Feature[] = [
  {
    id: 'astronaut',
    label: 'Vendeurs de Confiance',
    description: 'Des vendeurs vérifiés et fiables',
    icon: AstronautIcon,
  },
  {
    id: 'spaceship',
    label: 'Livraison Rapide',
    description: 'Partout au Sénégal',
    icon: SpaceshipIcon,
  },
  {
    id: 'telescope',
    label: 'Produits Vérifiés',
    description: 'Qualité garantie',
    icon: TelescopeIcon,
  },
  {
    id: 'satellite-dish',
    label: 'En Direct',
    description: 'Annonces mises à jour en temps réel',
    icon: SatelliteDishIcon,
    variant: 'accent',
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
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-500 mb-4 font-display">
            Pourquoi Yombal?
          </h2>
          <p className="text-accent-600 max-w-2xl mx-auto font-sans">
            Une plateforme moderne pour acheter et vendre localement au Sénégal
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="group flex flex-col items-center text-center gap-3">
                <IconBadge size={76} variant={feature.variant}>
                  <Icon />
                </IconBadge>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm font-sans">
                    {feature.label}
                  </h3>
                  <p className="text-xs text-accent-500 mt-1 font-sans">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
