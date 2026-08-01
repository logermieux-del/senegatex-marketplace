'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/common/Button';
import { Input, Select } from '@/components/common/Input';
import { Alert } from '@/components/common/Alert';
import { Card } from '@/components/common/Card';

const SENEGAL_REGIONS = [
  'Dakar',
  'Thiès',
  'Kaolack',
  'Saint-Louis',
  'Tambacounda',
  'Kolda',
  'Diourbel',
  'Louga',
  'Ziguinchor',
  'Sédhiou',
];

export default function TransporterRegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    typeVehicule: 'moto',
    plaqueImmatriculation: '',
    regionsCouvertes: [] as string[],
    tarifParZone: {} as Record<string, number>,
    capaciteVolume: 'moyen',
  });
  const [accepteConditions, setAccepteConditions] = useState(false);

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to register as a transporter.
            </p>
            <Button onClick={() => router.push('/login')}>Go to Login</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'loading') {
    return <div className="text-center py-12">Loading...</div>;
  }

  const handleRegionToggle = (region: string) => {
    setFormData((prev) => ({
      ...prev,
      regionsCouvertes: prev.regionsCouvertes.includes(region)
        ? prev.regionsCouvertes.filter((r) => r !== region)
        : [...prev.regionsCouvertes, region],
    }));
  };

  const handleTarifChange = (region: string, price: string) => {
    setFormData((prev) => ({
      ...prev,
      tarifParZone: {
        ...prev.tarifParZone,
        [region]: parseInt(price) || 0,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Register transporter
      const res = await fetch('/api/transporteurs/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, accepteConditions }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to register');
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Redirect to document upload
      setTimeout(() => {
        router.push(`/transporteurs/verify/${result.data.id}`);
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <Card.Header>
            <h1 className="text-3xl font-bold">Become a Transporter</h1>
            <p className="text-gray-600 mt-2">
              Join Yombal&apos;s network of trusted delivery partners
            </p>
          </Card.Header>

          <Card.Body>
            {error && <Alert type="error">{error}</Alert>}
            {success && (
              <Alert type="success">
                Registration successful! Redirecting...
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle Type */}
              <Select
                label="Vehicle Type"
                options={[
                  { value: 'moto', label: 'Motorcycle' },
                  { value: 'voiture', label: 'Car' },
                  { value: '3roues', label: 'Tricycle' },
                  { value: 'camionnette', label: 'Van' },
                ]}
                value={formData.typeVehicule}
                onChange={(e) =>
                  setFormData({ ...formData, typeVehicule: e.target.value })
                }
              />

              {/* License Plate */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  License Plate
                </label>
                <Input
                  type="text"
                  placeholder="e.g., SN 001 ABC"
                  value={formData.plaqueImmatriculation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plaqueImmatriculation: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Capacity */}
              <Select
                label="Cargo Capacity"
                options={[
                  { value: 'petit', label: 'Small (documents, small items)' },
                  { value: 'moyen', label: 'Medium (medium packages)' },
                  { value: 'gros', label: 'Large (furniture, heavy items)' },
                ]}
                value={formData.capaciteVolume}
                onChange={(e) =>
                  setFormData({ ...formData, capaciteVolume: e.target.value })
                }
              />

              {/* Service Regions */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Service Regions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {SENEGAL_REGIONS.map((region) => (
                    <label key={region} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.regionsCouvertes.includes(region)}
                        onChange={() => handleRegionToggle(region)}
                        className="mr-2"
                      />
                      <span className="text-sm">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tariffs */}
              {formData.regionsCouvertes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Tariffs per Region (XOF)
                  </label>
                  <div className="space-y-3">
                    {formData.regionsCouvertes.map((region) => (
                      <div key={region} className="flex items-center gap-3">
                        <span className="w-24 text-sm">{region}</span>
                        <Input
                          type="number"
                          placeholder="Price"
                          value={formData.tarifParZone[region] || ''}
                          onChange={(e) =>
                            handleTarifChange(region, e.target.value)
                          }
                          required
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms acceptance */}
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={accepteConditions}
                  onChange={(e) => setAccepteConditions(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  I accept Yombal&apos;s terms of service for transporters,
                  including the 5% commission on each delivery.
                </span>
              </label>

              <Button
                type="submit"
                disabled={
                  loading ||
                  !formData.plaqueImmatriculation ||
                  formData.regionsCouvertes.length === 0 ||
                  !accepteConditions
                }
                className="w-full"
              >
                {loading ? 'Registering...' : 'Continue to Verification'}
              </Button>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
