'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, Button, Alert, Textarea } from '@/components/common';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  category: string;
  photos: string[];
  thumbnail?: string;
  viewCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const [contactOpen, setContactOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) {
          setError('Listing not found');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setListing(data.data);
      } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert type="error">{error || 'Listing not found'}</Alert>
          <Link href="/" className="text-orange-500 hover:underline mt-4 inline-block">
            ← Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = (listing.price / 100000).toLocaleString('fr-SN');
  const displayPhotos = listing.photos && listing.photos.length > 0 ? listing.photos : [];
  const currentPhoto = displayPhotos[currentPhotoIndex];
  const isOwner = session?.user?.id === listing.user.id;

  const handleBuyClick = () => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/checkout?listingId=${listing.id}`)}`);
      return;
    }
    router.push(`/checkout?listingId=${listing.id}`);
  };

  const handleContactClick = () => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/listings/${listing.id}`)}`);
      return;
    }
    setContactOpen(true);
  };

  const handleSendMessage = async () => {
    setSendingMessage(true);
    setMessageError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: listing.user.id,
          listingId: listing.id,
          body: messageBody,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessageError(data.error || 'Failed to send message');
        return;
      }

      setMessageSent(true);
      setMessageBody('');
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setMessageError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-orange-500 hover:underline mb-6 inline-block">
          ← Back to listings
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Photos */}
          <div>
            <Card>
              {currentPhoto ? (
                <div className="w-full bg-gray-100 rounded overflow-hidden">
                  <img
                    src={currentPhoto}
                    alt={listing.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-orange-50 rounded flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
              )}

              {displayPhotos.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto">
                  {displayPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        idx === currentPhotoIndex
                          ? 'border-orange-500'
                          : 'border-gray-300 hover:border-orange-200'
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
            </Card>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="text-sm">{listing.city}</span>
                <span className="text-sm capitalize">{listing.category}</span>
                <span className="text-xs text-gray-400">
                  {new Date(listing.createdAt).toLocaleDateString('fr-SN')}
                </span>
              </div>
              <p className="text-3xl font-bold text-orange-500 mb-6">
                {formattedPrice}k XOF
              </p>
              {!isOwner && (
                <Button className="w-full" onClick={handleBuyClick}>
                  Acheter
                </Button>
              )}
            </div>

            {/* Description */}
            <Card>
              <h2 className="font-bold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </Card>

            {/* Seller */}
            <Card>
              <h2 className="font-bold mb-4">Seller Information</h2>
              <div className="flex items-center gap-4 mb-4">
                {listing.user.avatar ? (
                  <img
                    src={listing.user.avatar}
                    alt={listing.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                    {listing.user.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{listing.user.name}</p>
                  <p className="text-sm text-gray-600">{listing.user.email}</p>
                  {listing.user.phone && (
                    <p className="text-sm text-gray-600">{listing.user.phone}</p>
                  )}
                </div>
              </div>
              {isOwner ? (
                <p className="text-sm text-gray-500 italic">C'est votre annonce</p>
              ) : (
                <>
                  <Button className="w-full" variant="outline" onClick={handleContactClick}>
                    💬 Contact Seller
                  </Button>
                  {contactOpen && (
                    <div className="mt-4 space-y-3">
                      {messageSent ? (
                        <p className="text-sm text-green-600 font-medium">Message envoyé !</p>
                      ) : (
                        <>
                          <Textarea
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            placeholder="Votre message au vendeur..."
                            rows={4}
                            error={messageError}
                          />
                          <Button
                            className="w-full"
                            onClick={handleSendMessage}
                            isLoading={sendingMessage}
                            disabled={!messageBody.trim()}
                          >
                            Envoyer
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </Card>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-gray-600">
              <span>👁️ {listing.viewCount} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
