'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Loading } from '@/components/common/Loading';

interface Address {
  region: string;
  arrondissement?: string;
  rue?: string;
  lat?: number;
  lng?: number;
}

interface TimelineData {
  createdAt?: string;
  datePrise?: string;
  dateEstimeeArrivee?: string;
  dateArriveeReelle?: string;
}

interface GPSLocation {
  lat: number;
  lng: number;
  timestamp: string;
}

interface Transporteur {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleType: string;
  licensePlate: string;
  rating: number;
}

interface Rating {
  punctualite: number;
  etatProduit: number;
  communication: number;
  professionalisme: number;
  commentaire?: string;
}

interface LivraisonTracking {
  id: string;
  statut: string;
  adresseDepart: Address;
  adresseArrivee: Address;
  tarifs: {
    negocie: number;
    commission: number;
    montantTransporteur: number;
  };
  timeline: TimelineData;
  gps: GPSLocation | null;
  transporteur: Transporteur;
  proof: {
    photo?: string;
    rating: Rating | null;
  };
}

const STATUT_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
};

const STATUT_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PICKED_UP: 'bg-blue-100 text-blue-800',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
  DELIVERED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function LivraisonTrackingPage() {
  const params = useParams();
  const id = params.id as string;

  const [livraison, setLivraison] = useState<LivraisonTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh] = useState(true);

  useEffect(() => {
    const fetchLivraison = async () => {
      try {
        const res = await fetch(`/api/livraisons/${id}`);
        if (!res.ok) throw new Error('Failed to fetch livraison');
        const data = await res.json();
        setLivraison(data.data);
        setError('');
      } catch (err) {
        setError('Failed to load delivery tracking');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLivraison();

    // Auto-refresh every 10 seconds if in transit
    let interval: NodeJS.Timeout;
    if (autoRefresh && livraison?.statut === 'IN_TRANSIT') {
      interval = setInterval(fetchLivraison, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id, autoRefresh, livraison?.statut]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!livraison) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert type="error">
            Delivery not found. Please check the link and try again.
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && <Alert type="error">{error}</Alert>}

        {/* Status */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Delivery Tracking</h1>
              <div
                className={`px-4 py-2 rounded-full font-semibold ${
                  STATUT_COLORS[livraison.statut] || 'bg-gray-100'
                }`}
              >
                {STATUT_LABELS[livraison.statut] || livraison.statut}
              </div>
            </div>
          </Card.Header>

          <Card.Body className="space-y-6">
            {/* Timeline */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Timeline</h2>
              <div className="space-y-3">
                {livraison.timeline.createdAt && (
                  <div className="flex gap-4">
                    <div className="text-sm font-medium text-gray-600 w-24">
                      Created
                    </div>
                    <div className="text-sm text-gray-800">
                      {new Date(livraison.timeline.createdAt).toLocaleString()}
                    </div>
                  </div>
                )}

                {livraison.timeline.datePrise && (
                  <div className="flex gap-4">
                    <div className="text-sm font-medium text-gray-600 w-24">
                      Picked Up
                    </div>
                    <div className="text-sm text-gray-800">
                      {new Date(livraison.timeline.datePrise).toLocaleString()}
                    </div>
                  </div>
                )}

                {livraison.timeline.dateEstimeeArrivee && (
                  <div className="flex gap-4">
                    <div className="text-sm font-medium text-gray-600 w-24">
                      Est. Arrival
                    </div>
                    <div className="text-sm text-gray-800">
                      {new Date(
                        livraison.timeline.dateEstimeeArrivee
                      ).toLocaleString()}
                    </div>
                  </div>
                )}

                {livraison.timeline.dateArriveeReelle && (
                  <div className="flex gap-4">
                    <div className="text-sm font-medium text-gray-600 w-24">
                      Delivered
                    </div>
                    <div className="text-sm text-gray-800">
                      {new Date(
                        livraison.timeline.dateArriveeReelle
                      ).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">From</h3>
                <p className="text-sm text-gray-700">
                  {livraison.adresseDepart.region}
                  {livraison.adresseDepart.arrondissement &&
                    `, ${livraison.adresseDepart.arrondissement}`}
                </p>
                {livraison.adresseDepart.lat && livraison.adresseDepart.lng && (
                  <p className="text-xs text-gray-500">
                    {livraison.adresseDepart.lat.toFixed(4)},
                    {livraison.adresseDepart.lng.toFixed(4)}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">To</h3>
                <p className="text-sm text-gray-700">
                  {livraison.adresseArrivee.region}
                  {livraison.adresseArrivee.arrondissement &&
                    `, ${livraison.adresseArrivee.arrondissement}`}
                </p>
                {livraison.adresseArrivee.lat && livraison.adresseArrivee.lng && (
                  <p className="text-xs text-gray-500">
                    {livraison.adresseArrivee.lat.toFixed(4)},
                    {livraison.adresseArrivee.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>

            {/* Current GPS */}
            {livraison.gps && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold mb-2">Current Location</h3>
                <p className="text-sm text-gray-800">
                  {livraison.gps.lat.toFixed(4)}, {livraison.gps.lng.toFixed(4)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last update:{' '}
                  {new Date(livraison.gps.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Transporteur */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Transporter</h2>
          </Card.Header>
          <Card.Body>
            <div className="flex gap-4">
              {livraison.transporteur.avatar && (
                <img
                  src={livraison.transporteur.avatar}
                  alt={livraison.transporteur.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{livraison.transporteur.name}</h3>
                <p className="text-sm text-gray-600">
                  {livraison.transporteur.vehicleType} •{' '}
                  {livraison.transporteur.licensePlate}
                </p>
                <p className="text-sm text-gray-600">
                  ⭐ {livraison.transporteur.rating.toFixed(1)}/5
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  📞 {livraison.transporteur.phone}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Tariffs */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Pricing</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Delivery Price</span>
                <span className="font-semibold">
                  {(livraison.tarifs.negocie / 1000).toLocaleString()} XOF
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Yombal Commission (5%)</span>
                <span>
                  -{(livraison.tarifs.commission / 1000).toLocaleString()} XOF
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Transporter Earns</span>
                <span>
                  {(livraison.tarifs.montantTransporteur / 1000).toLocaleString()}{' '}
                  XOF
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Rating (if delivered) */}
        {livraison.statut === 'DELIVERED' && livraison.proof.rating && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Rating</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Punctuality</span>
                  <span>⭐ {livraison.proof.rating.punctualite}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Product Condition</span>
                  <span>⭐ {livraison.proof.rating.etatProduit}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Communication</span>
                  <span>⭐ {livraison.proof.rating.communication}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Professionalism</span>
                  <span>⭐ {livraison.proof.rating.professionalisme}/5</span>
                </div>
                {livraison.proof.rating.commentaire && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">
                      {livraison.proof.rating.commentaire}
                    </p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
}
