'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { IconBadge } from '@/components/icons/IconBadge';
import { EmptyBoxIcon, PinIcon } from '@/components/icons/CategoryIcons';

interface Adresse {
  region: string;
  arrondissement?: string;
  rue?: string;
}

interface Livraison {
  id: string;
  statut: string;
  tarifNegocie: number;
  adresseDepart: Adresse;
  adresseArrivee: Adresse;
  dates: {
    prise: string | null;
    estimeeArrivee: string | null;
    arriveeReelle: string | null;
  };
}

const STATUT_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'En attente', className: 'bg-neutral-100 text-neutral-700' },
  ACCEPTED: { label: 'Acceptée', className: 'bg-primary-100 text-primary-700' },
  PICKED_UP: { label: 'Récupérée', className: 'bg-primary-100 text-primary-700' },
  IN_TRANSIT: { label: 'En transit', className: 'bg-accent-100 text-accent-700' },
  DELIVERED: { label: 'Livrée', className: 'bg-success-100 text-success-700' },
  FAILED: { label: 'Échouée', className: 'bg-red-100 text-red-700' },
};

function formatAdresse(a: Adresse) {
  return [a.rue, a.arrondissement, a.region].filter(Boolean).join(', ');
}

export default function LivraisonsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [loading, setLoading] = useState(true);
  const [statutFilter, setStatutFilter] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/livraisons');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    const params = new URLSearchParams();
    if (statutFilter) params.append('statut', statutFilter);

    fetch(`/api/livraisons?${params}`)
      .then((res) => res.json())
      .then((data) => setLivraisons(data.data || []))
      .catch(() => setLivraisons([]))
      .finally(() => setLoading(false));
  }, [status, statutFilter]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-10 h-10 rounded-full border-4 border-accent-200 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  const statuts = ['', 'PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCity={selectedCity}
        onSelectedCityChange={setSelectedCity}
      />
      <div className="min-h-screen bg-neutral-50">
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary-500 font-display">Mes livraisons</h1>
            <p className="text-accent-600 mt-2 font-sans">Suivez vos courses en tant que transporteur</p>
          </div>

          <div className="flex gap-2 mb-8 border-b border-accent-200 pb-4 overflow-x-auto">
            {statuts.map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setStatutFilter(s)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all font-sans ${
                  statutFilter === s
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-accent-600 border border-accent-200 hover:border-primary-300 hover:text-primary-500'
                }`}
              >
                {s ? STATUT_LABELS[s].label : 'Toutes'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 rounded-full border-4 border-accent-200 border-t-primary-500 animate-spin" />
            </div>
          ) : livraisons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <IconBadge size={72} className="mb-4">
                <EmptyBoxIcon className="w-9 h-9" />
              </IconBadge>
              <p className="text-xl text-accent-600 font-medium font-sans">Aucune livraison</p>
              <p className="text-accent-500 mt-2 font-sans">Vos courses assignées apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-4">
              {livraisons.map((l) => {
                const statut = STATUT_LABELS[l.statut] || STATUT_LABELS.PENDING;
                return (
                  <Link
                    key={l.id}
                    href={`/livraisons/${l.id}/tracking`}
                    className="block bg-white rounded-xl border border-accent-200 p-5 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm text-neutral-900 font-sans">
                          <PinIcon className="w-4 h-4 flex-shrink-0 text-accent-500" />
                          <span className="truncate">{formatAdresse(l.adresseDepart)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-900 mt-1 font-sans">
                          <PinIcon className="w-4 h-4 flex-shrink-0 text-primary-500" />
                          <span className="truncate">{formatAdresse(l.adresseArrivee)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold font-sans ${statut.className}`}>
                          {statut.label}
                        </span>
                        <span className="text-lg font-bold text-success-500 font-sans">
                          {l.tarifNegocie.toLocaleString('fr-SN')} XOF
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
