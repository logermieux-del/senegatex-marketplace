'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, Alert } from '@/components/common';
import { PhotoUpload } from '@/components/listings/PhotoUpload';

const categories = [
  'electronics',
  'furniture',
  'vehicles',
  'clothing',
  'accessories',
  'books',
  'sports',
  'services',
  'other',
];

const cities = [
  'Dakar',
  'Thiès',
  'Kaolack',
  'Saint-Louis',
  'Ziguinchor',
  'Tambacounda',
  'Kolda',
  'Louga',
];

export default function CreateListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    price: '',
    city: 'Dakar',
    region: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/listings/create');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const price = Math.floor(parseFloat(formData.price) * 100000);

      if (!formData.title || !formData.description || !formData.price) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (price <= 0) {
        setError('Price must be greater than 0');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price,
          photos: photos.length > 0 ? photos : undefined,
          thumbnail: photos.length > 0 ? photos[0] : undefined,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error || 'Failed to create listing');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-orange-500 hover:underline mb-6 inline-block">
          ← Back to listings
        </Link>

        <Card>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
            <p className="text-gray-600">Sell your item to the Senegal community</p>
          </div>

          {error && <Alert type="error" className="mb-6">{error}</Alert>}
          {success && (
            <Alert type="success" className="mb-6">
              Listing published! Redirecting...
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., iPhone 13 Pro"
                maxLength={100}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the condition, features, and why you're selling..."
                maxLength={2000}
                required
                rows={6}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/2000
              </p>
            </div>

            {/* Photos */}
            <PhotoUpload onPhotosChange={setPhotos} maxPhotos={5} />

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Price (XOF) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 800000"
                step="1000"
                min="0"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter price in XOF (West African CFA Franc)
              </p>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-2">
                City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Optional: neighborhood or district"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-500 text-white px-6 py-3 rounded font-medium hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Publishing...' : 'Publish Listing'}
              </button>
              <Link href="/">
                <button
                  type="button"
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
