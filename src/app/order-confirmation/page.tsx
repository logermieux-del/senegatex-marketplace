'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmation />
    </Suspense>
  );
}

function OrderConfirmation() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <main className="min-h-screen bg-neutral-50">
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCity={selectedCity}
        onSelectedCityChange={setSelectedCity}
      />

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-accent-200 p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2 font-sans">Order Confirmed!</h1>
          <p className="text-accent-600 mb-6 font-sans">
            Your purchase has been successfully processed.
          </p>

          {transactionId && (
            <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-sm">
              <p className="text-accent-600 font-sans">Transaction ID</p>
              <p className="font-mono font-bold text-neutral-900 break-all">{transactionId}</p>
            </div>
          )}

          <div className="space-y-3 text-sm text-accent-600 mb-8 font-sans">
            <p>✓ Seller has been notified</p>
            <p>✓ You will receive confirmation email</p>
            <p>✓ Contact seller to arrange pickup/delivery</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/messages"
              className="block w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors font-sans"
            >
              View Messages
            </Link>
            <Link
              href="/"
              className="block w-full border-2 border-accent-300 py-2 rounded-lg hover:bg-accent-50 transition-colors font-sans"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
