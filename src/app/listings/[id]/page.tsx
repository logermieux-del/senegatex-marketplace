'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { IconBadge } from '@/components/icons/IconBadge';
import { PinIcon, PhotoIcon, EmptyBoxIcon } from '@/components/icons/CategoryIcons';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

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
          setError('Annonce introuvable');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setListing(data.data);
      } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
        setError('Échec du chargement de l\'annonce');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const header = (
    <Header
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      selectedCity={selectedCity}
      onSelectedCityChange={setSelectedCity}
    />
  );

  if (loading) {
    return (
      <>
        {header}
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="w-10 h-10 rounded-full border-4 border-accent-200 border-t-primary-500 animate-spin" />
        </div>
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        {header}
        <div className="min-h-screen bg-neutral-50">
          <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center text-center">
            <IconBadge size={72} className="mb-4">
              <EmptyBoxIcon className="w-9 h-9" />
            </IconBadge>
            <p className="text-xl text-accent-600 font-medium font-sans">{error || 'Annonce introuvable'}</p>
            <Link href="/" className="text-primary-500 hover:underline mt-4 inline-block font-sans">
              ← Retour aux annonces
            </Link>
          </div>
        </div>
      </>
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
        setMessageError(data.error || 'Échec de l\'envoi du message');
        return;
      }

      setMessageSent(true);
      setMessageBody('');
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setMessageError('Échec de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <>
      {header}
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Link href="/" className="text-primary-500 hover:underline mb-6 inline-block font-sans">
            ← Retour aux annonces
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Photos */}
            <div>
              <div className="bg-white rounded-xl border border-accent-200 p-4">
                <div className="w-full bg-neutral-100 rounded-lg overflow-hidden h-96">
                  {currentPhoto ? (
                    <img
                      src={currentPhoto}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-100 to-neutral-100 flex items-center justify-center">
                      <IconBadge size={64}>
                        <PhotoIcon className="w-8 h-8" />
                      </IconBadge>
                    </div>
                  )}
                </div>

                {displayPhotos.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto">
                    {displayPhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPhotoIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                          idx === currentPhotoIndex
                            ? 'border-primary-500'
                            : 'border-accent-200 hover:border-primary-300'
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
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-display">{listing.title}</h1>
                <div className="flex items-center gap-4 text-accent-600 mb-4 font-sans">
                  <span className="flex items-center gap-1.5 text-sm">
                    <PinIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {listing.city}
                  </span>
                  <span className="text-sm capitalize">{listing.category}</span>
                  <span className="text-xs text-accent-400">
                    {new Date(listing.createdAt).toLocaleDateString('fr-SN')}
                  </span>
                </div>
                <p className="text-3xl font-bold text-success-500 mb-6 font-sans">
                  {formattedPrice}k <span className="text-base text-accent-500 font-normal">XOF</span>
                </p>
                {!isOwner && (
                  <button
                    onClick={handleBuyClick}
                    className="w-full bg-primary-500 text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium font-sans"
                  >
                    Acheter
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-accent-200 p-5">
                <h2 className="font-bold text-neutral-900 mb-3 font-sans">Description</h2>
                <p className="text-accent-700 whitespace-pre-wrap font-sans">{listing.description}</p>
              </div>

              {/* Seller */}
              <div className="bg-white rounded-xl border border-accent-200 p-5">
                <h2 className="font-bold text-neutral-900 mb-4 font-sans">Vendeur</h2>
                <div className="flex items-center gap-4 mb-4">
                  {listing.user.avatar ? (
                    <img
                      src={listing.user.avatar}
                      alt={listing.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                      {listing.user.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-neutral-900 font-sans">{listing.user.name}</p>
                    <p className="text-sm text-accent-600 font-sans">{listing.user.email}</p>
                    {listing.user.phone && (
                      <p className="text-sm text-accent-600 font-sans">{listing.user.phone}</p>
                    )}
                  </div>
                </div>
                {isOwner ? (
                  <p className="text-sm text-accent-500 italic font-sans">C&apos;est votre annonce</p>
                ) : (
                  <>
                    <button
                      onClick={handleContactClick}
                      className="w-full border border-accent-300 text-accent-700 px-4 py-3 rounded-lg hover:border-primary-300 hover:text-primary-500 transition-colors font-medium font-sans"
                    >
                      💬 Contacter le vendeur
                    </button>
                    {contactOpen && (
                      <div className="mt-4 space-y-3">
                        {messageSent ? (
                          <p className="text-sm text-success-600 font-medium font-sans">Message envoyé !</p>
                        ) : (
                          <>
                            <textarea
                              value={messageBody}
                              onChange={(e) => setMessageBody(e.target.value)}
                              placeholder="Votre message au vendeur..."
                              rows={4}
                              className="w-full px-4 py-2 border border-accent-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none font-sans"
                            />
                            {messageError && (
                              <p className="text-sm text-red-600 font-sans">{messageError}</p>
                            )}
                            <button
                              onClick={handleSendMessage}
                              disabled={!messageBody.trim() || sendingMessage}
                              className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium font-sans"
                            >
                              {sendingMessage ? 'Envoi...' : 'Envoyer'}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-1.5 text-sm text-accent-500 font-sans">
                <Eye className="w-4 h-4" />
                <span>{listing.viewCount} vues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
