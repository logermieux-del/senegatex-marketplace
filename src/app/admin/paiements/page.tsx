'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardBody, Button, Alert } from '@/components/common';

interface Paiement {
  id: string;
  transporteurNom: string;
  transporteurPhone?: string;
  livraisonId: string;
  montant: number;
  statut: string;
  createdAt: string;
}

const METHODES = [
  { value: 'wave', label: 'Wave' },
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'cash', label: 'Espèces' },
  { value: 'virement', label: 'Virement' },
];

export default function AdminPaiementsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [totalDu, setTotalDu] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (session && session.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, router]);

  const fetchPaiements = () => {
    fetch('/api/admin/paiements?statut=PENDING')
      .then((res) => res.json())
      .then((data) => {
        setPaiements(data.data || []);
        setTotalDu(data.totalDu || 0);
      })
      .catch(() => setError('Failed to load paiements'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPaiements();
  }, []);

  const markAsPaid = async (id: string, methode: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/paiements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ methode }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to mark as paid');
        return;
      }

      setPaiements((prev) => prev.filter((p) => p.id !== id));
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Paiements Transporteurs</h1>

        {error && <Alert type="error">{error}</Alert>}

        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600">Total dû aux transporteurs</p>
            <p className="text-3xl font-bold text-orange-500">
              {totalDu.toLocaleString()} XOF
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">En attente de paiement ({paiements.length})</h2>
          </CardHeader>
          <CardBody>
            {paiements.length === 0 ? (
              <p className="text-gray-600 text-sm">Aucun paiement en attente 🎉</p>
            ) : (
              <div className="space-y-4">
                {paiements.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-semibold">{p.transporteurNom}</p>
                      <p className="text-sm text-gray-600">{p.transporteurPhone}</p>
                      <p className="text-xs text-gray-500">
                        Livraison #{p.livraisonId.slice(0, 8)} •{' '}
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-bold text-orange-500 mt-1">
                        {p.montant.toLocaleString()} XOF
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {METHODES.map((m) => (
                        <Button
                          key={m.value}
                          variant="outline"
                          size="sm"
                          disabled={processingId === p.id}
                          onClick={() => markAsPaid(p.id, m.value)}
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
