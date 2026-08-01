'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import Link from 'next/link';

interface TransporterProfile {
  id: string;
  name: string;
  avatar?: string;
  typeVehicule: string;
  plaqueImmatriculation: string;
  regionsCouvertes: string[];
  capaciteVolume: string;
  statut: string;
  rating: {
    average: number;
    totalDeliveries: number;
    disputeRate: number;
    reliability: string;
  };
}

export default function TransporteurDashboardPage() {
  const { status } = useSession();
  const [profile, setProfile] = useState<TransporterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      // Get user's transporter profile
      const res = await fetch('/api/transporteurs/me', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        setError('Failed to load profile');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setProfile(data.data);
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center">
            <p className="mb-4">Please sign in to access your dashboard</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <Card.Header>
              <h1 className="text-3xl font-bold">Become a Transporter</h1>
            </Card.Header>
            <Card.Body>
              <Alert type="warning">
                You don&apos;t have a transporter profile yet.
              </Alert>
              <Link href="/transporteurs/register">
                <Button className="mt-4">Register as Transporter</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && <Alert type="error">{error}</Alert>}

        {/* Header */}
        <Card>
          <Card.Header>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-gray-600 mt-1">
                  {profile.typeVehicule.toUpperCase()} •{' '}
                  {profile.plaqueImmatriculation}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-500">
                  {profile.rating.average.toFixed(1)}/5
                </div>
                <p className="text-sm text-gray-600">
                  {profile.rating.totalDeliveries} deliveries
                </p>
              </div>
            </div>
          </Card.Header>

          <Card.Body>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold capitalize">{profile.statut}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reliability</p>
                <p className="font-semibold">{profile.rating.reliability}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-semibold capitalize">
                  {profile.capaciteVolume}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dispute Rate</p>
                <p className="font-semibold">{profile.rating.disputeRate}%</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Service Regions */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold">Service Regions</h2>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-wrap gap-2">
              {profile.regionsCouvertes.map((region) => (
                <span
                  key={region}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {region}
                </span>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </Card.Header>
          <Card.Body className="space-y-3">
            <Link href="/dashboard/livraisons">
              <Button variant="secondary" className="w-full">
                View Deliveries
              </Button>
            </Link>
            <Link href={`/transporteurs/${profile.id}/edit`}>
              <Button variant="secondary" className="w-full">
                Edit Profile
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              View Earnings
            </Button>
          </Card.Body>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <Card.Body className="text-center">
              <p className="text-3xl font-bold text-orange-500">
                {profile.rating.totalDeliveries}
              </p>
              <p className="text-sm text-gray-600">Total Deliveries</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="text-center">
              <p className="text-3xl font-bold text-green-500">
                {profile.rating.reliability}
              </p>
              <p className="text-sm text-gray-600">Reliability Score</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="text-center">
              <p className="text-3xl font-bold text-red-500">
                {profile.rating.disputeRate}%
              </p>
              <p className="text-sm text-gray-600">Dispute Rate</p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
