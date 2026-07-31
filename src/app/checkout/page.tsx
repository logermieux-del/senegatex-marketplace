'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CheckoutListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  thumbnail?: string;
  user: {
    name: string;
  };
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get('listingId');

  const [listing, setListing] = useState<CheckoutListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wave'>('stripe');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buyer info
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  useEffect(() => {
    if (!listingId) {
      router.push('/');
      return;
    }

    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${listingId}`);
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
  }, [listingId, router]);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      if (!listing) throw new Error('Listing not found');
      if (!buyerName || !buyerEmail || !buyerPhone) {
        throw new Error('Please fill in all fields');
      }

      const endpoint = `/api/payments/${paymentMethod}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          amount: listing.price,
          currency: listing.currency,
          paymentMethod,
          buyerName,
          buyerEmail,
          buyerPhone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Payment failed');
      }

      const data = await res.json();

      if (paymentMethod === 'stripe' && data.clientSecret) {
        // Redirect to Stripe (would use Stripe JS in production)
        console.log('Stripe payment initiated:', data.clientSecret);
        alert('Stripe payment would be processed here (demo mode)');
      } else if (paymentMethod === 'wave' && data.paymentUrl) {
        // Redirect to Wave
        window.location.href = data.paymentUrl;
      }

      // On success, redirect
      setTimeout(() => {
        router.push(`/order-confirmation?transactionId=${data.transactionId}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Listing not found'}</p>
          <Link href="/" className="text-orange-500">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Senegatex
          </Link>
        </nav>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href={`/listings/${listing.id}`} className="text-orange-500 hover:underline mb-6 inline-block">
          ← Back to listing
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Checkout</h2>

              {/* Product Summary */}
              <div className="border-b pb-6 mb-6">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="flex gap-4">
                  {listing.thumbnail && (
                    <img
                      src={listing.thumbnail}
                      alt={listing.title}
                      className="w-20 h-20 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{listing.title}</p>
                    <p className="text-gray-600 text-sm">Seller: {listing.user.name}</p>
                    <p className="font-bold text-lg mt-2">
                      {(listing.price / 1000).toLocaleString()}k {listing.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="mb-6">
                <h3 className="font-bold mb-4">Your Information</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="+221 77 123 4567"
                    />
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-bold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center border rounded p-4 cursor-pointer hover:bg-gray-50" style={{ borderColor: paymentMethod === 'stripe' ? '#f97316' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'wave')}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-semibold">💳 Card Payment (Stripe)</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                    </div>
                  </label>

                  <label className="flex items-center border rounded p-4 cursor-pointer hover:bg-gray-50" style={{ borderColor: paymentMethod === 'wave' ? '#f97316' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="payment"
                      value="wave"
                      checked={paymentMethod === 'wave'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'wave')}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-semibold">📱 Wave Money</p>
                      <p className="text-sm text-gray-600">Senegal mobile money</p>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <div className="bg-white rounded-lg p-6 sticky top-4">
              <h3 className="font-bold mb-4">Price Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Item price</span>
                  <span>{(listing.price / 1000).toLocaleString()}k {listing.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free (local pickup)</span>
                </div>
                <div className="flex justify-between">
                  <span>Fees</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{(listing.price / 1000).toLocaleString()}k {listing.currency}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                By completing this purchase, you agree to our terms and conditions. The seller will be notified to arrange delivery or pickup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
