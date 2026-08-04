'use client';

import { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface ReportFormProps {
  listingId: string;
  listingTitle: string;
  onSuccess?: () => void;
}

export function ReportForm({
  listingId,
  listingTitle,
  onSuccess,
}: ReportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const REPORT_REASONS = [
    { value: 'inappropriate', label: '📋 Contenu inapproprié' },
    { value: 'fraud', label: '🚨 Fraude/Arnaque' },
    { value: 'duplicate', label: '📌 Doublon' },
    { value: 'contact_info', label: '📞 Coordonnées personnelles' },
    { value: 'offensive', label: '⚠️ Offensant/Haineux' },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          listingId,
          reason,
          description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit report');
      }

      setStatus('success');
      setReason('');
      setDescription('');
      setTimeout(() => {
        setIsOpen(false);
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <AlertCircle className="w-4 h-4" />
        Report listing
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Report Listing</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {listingTitle}
              </p>
            </div>

            {/* Success State */}
            {status === 'success' && (
              <div className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <Check className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="font-semibold text-green-600 mb-2">
                  Merci pour votre signalement
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notre équipe examinera rapidement ce signalement.
                </p>
              </div>
            )}

            {/* Form */}
            {status !== 'success' && (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Reason Select */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Raison du signalement
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une raison...</option>
                    {REPORT_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description (minimum 10 caractères)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Expliquez pourquoi cette annonce devrait être examinée..."
                    minLength={10}
                    maxLength={1000}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {description.length}/1000
                  </p>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm rounded-lg">
                    {errorMessage}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !reason || description.length < 10
                    }
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Envoi...' : 'Signaler'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
