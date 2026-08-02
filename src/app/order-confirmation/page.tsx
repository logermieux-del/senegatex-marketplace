'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Yombal
          </Link>
        </nav>
      </header>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your purchase has been successfully processed.
          </p>

          {transactionId && (
            <div className="bg-gray-50 rounded p-4 mb-6 text-sm">
              <p className="text-gray-600">Transaction ID</p>
              <p className="font-mono font-bold text-gray-900 break-all">{transactionId}</p>
            </div>
          )}

          <div className="space-y-3 text-sm text-gray-600 mb-8">
            <p>✓ Seller has been notified</p>
            <p>✓ You will receive confirmation email</p>
            <p>✓ Contact seller to arrange pickup/delivery</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/messages"
              className="block w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              View Messages
            </Link>
            <Link
              href="/"
              className="block w-full border-2 border-gray-300 py-2 rounded hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
