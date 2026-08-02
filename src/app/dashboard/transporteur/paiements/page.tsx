'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import Link from 'next/link';

interface Paiement {
  id: string;
  livraisonId: string;
  montant: number;
  statut: string;
  methode?: string;
  reference?: string;
  paidAt?: string;
  createdAt: string;
}

interface PaiementsData {
  resume: { totalEnAttente: number; totalPaye: number; devise: string };
  paiements: Paiement[];
}

const STATUT_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  PAID: 'Payé',
  FAILED: 'Échec',
};

const STATUT_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function TransporteurPaiementsPage() {
  const { status } = useSession();
  const [data, setData] = useState<PaiementsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/transporteurs/me/paiements')
        .then((res) => res.json())
        .then((res) => setData(res.data))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <Card.Body>
              <p>Aucun profil transporteur trouvé.</p>
              <Link href="/transporteurs/register">
                <Button className="mt-4">S&apos;inscrire comme transporteur</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <Card.Body className="text-center">
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-orange-500">
                {data.resume.totalEnAttente.toLocaleString()} {data.resume.devise}
              </p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <p className="text-sm text-gray-600">Total payé</p>
              <p className="text-2xl font-bold text-green-600">
                {data.resume.totalPaye.toLocaleString()} {data.resume.devise}
              </p>
            </Card.Body>
          </Card>
        </div>

        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold">Historique des paiements</h2>
          </Card.Header>
          <Card.Body>
            {data.paiements.length === 0 ? (
              <p className="text-gray-600 text-sm">Aucun paiement pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {data.paiements.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {p.montant.toLocaleString()} XOF
                      </p>
                      <p className="text-xs text-gray-500">
                        Livraison #{p.livraisonId.slice(0, 8)} •{' '}
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                      {p.methode && (
                        <p className="text-xs text-gray-500">
                          via {p.methode} {p.reference && `(${p.reference})`}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUT_COLORS[p.statut] || 'bg-gray-100'
                      }`}
                    >
                      {STATUT_LABELS[p.statut] || p.statut}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
