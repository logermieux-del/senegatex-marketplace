// Livraison configuration
export const LIVRAISON_CONFIG = {
  DELIVERY_ESTIMATE_HOURS: 2,
  COMMISSION_PERCENT: 5,
  AUTO_REFRESH_INTERVAL_MS: 10000,
  MOCK_GPS_PROGRESS_VALUES: [0, 0.2, 0.4, 0.6, 0.8, 1],
} as const;

// Status configuration
export const LIVRAISON_STATUS_CONFIG = {
  PENDING: {
    label: 'En attente',
    color: 'text-yellow-600 bg-yellow-50',
    icon: '⏳',
  },
  ACCEPTED: {
    label: 'Accepté',
    color: 'text-blue-600 bg-blue-50',
    icon: '✓',
  },
  IN_TRANSIT: {
    label: 'En transit',
    color: 'text-blue-700 bg-blue-100',
    icon: '🚗',
  },
  DELIVERED: {
    label: 'Livré',
    color: 'text-green-600 bg-green-50',
    icon: '✓✓',
  },
  CANCELLED: {
    label: 'Annulé',
    color: 'text-red-600 bg-red-50',
    icon: '✗',
  },
} as const;

export const ACTIVE_TRANSPORTEUR_STATUTS = ['VERIFIED', 'ACTIVE'] as const;
