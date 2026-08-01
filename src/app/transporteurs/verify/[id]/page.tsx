'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Card } from '@/components/common/Card';

export default function VerifyTransporterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [files, setFiles] = useState({
    cin: null as File | null,
    photoVehicule: null as File | null,
  });

  // Initialize from params (used to track that page loaded properly)
  useEffect(() => {
    params.then((_p) => {
      // Page loaded for transporter ID, ready for upload
    });
  }, [params]);

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-center">Please sign in first</p>
        </Card>
      </div>
    );
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'cin' | 'photoVehicule'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!files.cin || !files.photoVehicule) {
      setError('Both CIN and vehicle photo are required');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cin', files.cin);
      formData.append('photoVehicule', files.photoVehicule);

      const res = await fetch('/api/transporteurs/upload-docs', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to upload documents');
        setLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard/transporteur');
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
            <h1 className="text-3xl font-bold">Verify Your Identity</h1>
            <p className="text-gray-600 mt-2">
              Upload required documents to activate your transporter profile
            </p>
          </Card.Header>

          <Card.Body>
            {error && <Alert type="error">{error}</Alert>}
            {success && (
              <Alert type="success">
                Documents uploaded successfully! Redirecting...
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* CIN Upload */}
              <div className="border-2 border-dashed rounded-lg p-6">
                <label className="block text-sm font-medium mb-4">
                  Senegal National ID (CIN) - Front & Back
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, 'cin')}
                  className="w-full mb-3"
                  required
                />
                {files.cin && (
                  <p className="text-sm text-green-600">
                    ✓ {files.cin.name} selected
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Accepted: JPG, PNG, PDF (max 10MB)
                </p>
              </div>

              {/* Vehicle Photo */}
              <div className="border-2 border-dashed rounded-lg p-6">
                <label className="block text-sm font-medium mb-4">
                  Vehicle Photo (Clear, Full View)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photoVehicule')}
                  className="w-full mb-3"
                  required
                />
                {files.photoVehicule && (
                  <p className="text-sm text-green-600">
                    ✓ {files.photoVehicule.name} selected
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Accepted: JPG, PNG (max 10MB)
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold text-sm mb-2">Document Requirements:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ CIN must be valid (not expired)</li>
                  <li>✓ Vehicle photo must show license plate clearly</li>
                  <li>✓ Photos must be clear and legible</li>
                  <li>✓ Documents will be verified within 24 hours</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading || !files.cin || !files.photoVehicule}
                className="w-full"
              >
                {loading ? 'Uploading...' : 'Upload Documents'}
              </Button>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
