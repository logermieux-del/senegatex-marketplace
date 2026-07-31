'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  category: string;
  photos: string[];
  thumbnail?: string;
  viewCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (!res.ok) throw new Error('Listing not found');
        const data = await res.json();
        setListing(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Listing not found'}</p>
          <Link href="/" className="text-orange-500 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos
    : [listing.thumbnail || '/placeholder.jpg'];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Senegatex
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-700 hover:text-orange-500">
              Login
            </Link>
            <Link href="/signup" className="bg-orange-500 text-white px-4 py-2 rounded">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="text-orange-500 hover:underline mb-4 inline-block">
          ← Back
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Photos Section */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={photos[selectedPhotoIndex]}
                alt={listing.title}
                className="w-full h-96 object-cover"
              />
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${
                      idx === selectedPhotoIndex
                        ? 'border-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`${listing.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-gray-600 mb-4">
              {listing.city} • {listing.category}
            </p>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {(listing.price / 1000).toLocaleString('en-US')}k {listing.currency}
              </div>
              <p className="text-sm text-gray-600">
                Posted {new Date(listing.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="font-bold text-lg mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Seller Card */}
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="font-bold mb-3">Seller</h3>
              <div className="flex items-center gap-3 mb-4">
                {listing.user.avatar && (
                  <img
                    src={listing.user.avatar}
                    alt={listing.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold">{listing.user.name}</p>
                  <p className="text-sm text-gray-600">Verified Seller</p>
                </div>
              </div>
              <button className="w-full border-2 border-orange-500 text-orange-500 py-2 rounded hover:bg-orange-50">
                Contact Seller
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/checkout?listingId=${listing.id}`)}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600"
              >
                Buy Now
              </button>
              <button className="w-full border-2 border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50">
                Add to Favorites
              </button>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-600">
              <p>👁️ {listing.viewCount} views</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
