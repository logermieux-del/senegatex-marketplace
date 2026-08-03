'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardBody, Button, Alert } from '@/components/common';

interface Remboursement {
  id: string;
  livraisonId: string;
  beneficiaireNom: string;
  beneficiairePhone?: string;
  raison: string;
  montant: number;
  createdAt: string;
}

interface AssuranceData {
  taux: string;
  fonds: { totalCollecte: number; totalRembourse: number; solde: number };
  remboursementsEnAttente: Remboursement[];
}

const METHODES = [
  { value: 'wave', label: 'Wave' },
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'cash', label: 'Espèces' },
  { value: 'virement', label: 'Virement' },
];

export default function AdminAssurancePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<AssuranceData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (session && session.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, router]);

  const fetchData = () => {
    fetch('/api/admin/assurance')
      .then((res) => res.json())
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load assurance data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAsPaid = async (id: string, methode: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/assurance/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ methode }),
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error || 'Failed to mark as paid');
        return;
      }

      // Update state locally instead of refetching
      setData((prev) => {
        if (!prev) return prev;
        const paid = prev.remboursementsEnAttente.find((r) => r.id === id);
        if (!paid) return prev;

        return {
          ...prev,
          fonds: {
            totalCollecte: prev.fonds.totalCollecte,
            totalRembourse: prev.fonds.totalRembourse + paid.montant,
            solde: prev.fonds.solde - paid.montant,
          },
          remboursementsEnAttente: prev.remboursementsEnAttente.filter((r) => r.id !== id),
        };
      });
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {error && <Alert type="error">{error}</Alert>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Fonds Assurance Livraison</h1>
        <p className="text-accent-600 text-sm">
          Surcharge de {data.taux} appliquée sur chaque livraison, finançant les
          remboursements en cas de litige validé.
        </p>

        {error && <Alert type="error">{error}</Alert>}

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardBody className="text-center">
              <p className="text-sm text-accent-600">Collecté</p>
              <p className="text-2xl font-bold text-accent-800">
                {data.fonds.totalCollecte.toLocaleString()} XOF
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-sm text-accent-600">Remboursé</p>
              <p className="text-2xl font-bold text-red-500">
                {data.fonds.totalRembourse.toLocaleString()} XOF
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <p className="text-sm text-accent-600">Solde disponible</p>
              <p className="text-2xl font-bold text-green-600">
                {data.fonds.solde.toLocaleString()} XOF
              </p>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">
              Remboursements en attente ({data.remboursementsEnAttente.length})
            </h2>
          </CardHeader>
          <CardBody>
            {data.remboursementsEnAttente.length === 0 ? (
              <p className="text-accent-600 text-sm">Aucun remboursement en attente 🎉</p>
            ) : (
              <div className="space-y-4">
                {data.remboursementsEnAttente.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between border-b border-accent-100 pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-semibold">{r.beneficiaireNom}</p>
                      <p className="text-sm text-accent-600">{r.beneficiairePhone}</p>
                      <p className="text-xs text-accent-500 capitalize">
                        {r.raison.replace('_', ' ')} • Livraison #{r.livraisonId.slice(0, 8)} •{' '}
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-bold text-primary-500 mt-1">
                        {r.montant.toLocaleString()} XOF
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {METHODES.map((m) => (
                        <Button
                          key={m.value}
                          variant="outline"
                          size="sm"
                          disabled={processingId === r.id}
                          onClick={() => markAsPaid(r.id, m.value)}
                        >
                          {m.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
