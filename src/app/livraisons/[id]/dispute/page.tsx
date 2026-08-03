'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Select, Textarea } from '@/components/common/Input';

const RAISONS = [
  { value: 'produit_casse', label: 'Produit endommagé' },
  { value: 'non_recu', label: 'Colis non reçu' },
  { value: 'retard', label: 'Retard important' },
  { value: 'autre', label: 'Autre problème' },
];

export default function SignalerProblemePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { status } = useSession();

  const [raison, setRaison] = useState('produit_casse');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
            <p className="text-accent-600 mb-6">
              Connectez-vous pour signaler un problème.
            </p>
            <Button onClick={() => router.push('/login')}>Se connecter</Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (description.trim().length < 10) {
      setError('Merci de décrire le problème en au moins 10 caractères.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livraisonId: id, raison, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <Card>
            <Card.Body>
              <Alert type="success">
                Votre signalement a été enregistré. Notre équipe va l&apos;examiner
                sous peu.
              </Alert>
              <Button className="mt-4 w-full" onClick={() => router.push(`/livraisons/${id}/tracking`)}>
                Retour au suivi
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Card>
          <Card.Header>
            <h1 className="text-2xl font-bold">Signaler un problème</h1>
            <p className="text-sm text-accent-600 mt-1">Livraison #{id}</p>
          </Card.Header>
          <Card.Body>
            {error && (
              <div className="mb-4">
                <Alert type="error">{error}</Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Type de problème"
                value={raison}
                onChange={(e) => setRaison(e.target.value)}
                options={RAISONS}
              />

              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Décrivez ce qui s'est passé (minimum 10 caractères)"
                hint={`${description.length}/1000`}
                maxLength={1000}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Envoi...' : 'Envoyer le signalement'}
              </Button>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
