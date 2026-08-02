import { Heart } from 'lucide-react';

/* Result Card (Trajet) */
export function ResultCard({
  from,
  to,
  status,
  timestamp,
}: {
  from: string;
  to: string;
  status: 'livré' | 'en-cours' | 'retard';
  timestamp: string;
}) {
  const statusConfig = {
    livré: { bg: 'bg-green-600', text: '✓ LIVRÉ' },
    'en-cours': { bg: 'bg-orange-600', text: '● EN COURS' },
    retard: { bg: 'bg-red-600', text: '⚠️ RETARD' },
  };

  return (
    <div className="bg-secondary-800 border border-gray-700 rounded-lg p-6 hover:border-primary-600 transition-all">
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* From */}
        <div className="text-center">
          <div className="text-2xl mb-2">📦</div>
          <div className="font-bold text-sm">{from}</div>
        </div>

        {/* Arrow + Status */}
        <div className="text-center">
          <div className="text-2xl mb-2">→</div>
          <div className={`${statusConfig[status].bg} text-white text-xs font-bold px-3 py-1 rounded inline-block`}>
            {statusConfig[status].text}
          </div>
          <div className="text-xs text-gray-400 mt-2">{timestamp}</div>
        </div>

        {/* To */}
        <div className="text-center">
          <div className="text-2xl mb-2">🏁</div>
          <div className="font-bold text-sm">{to}</div>
        </div>
      </div>
    </div>
  );
}

/* Transporter Card */
export function TransporterCard({
  name,
  rating,
  trips,
  badge,
  onAction,
}: {
  name: string;
  rating: number;
  trips: number;
  badge: string;
  onAction?: () => void;
}) {
  return (
    <div className="w-64 bg-secondary-800 border border-gray-700 rounded-lg p-6 hover:border-primary-600 transition-all">
      <div className="text-center mb-4">
        <div className="w-20 h-20 bg-primary-600 rounded-full mx-auto flex items-center justify-center text-3xl mb-3">
          👤
        </div>
        <h3 className="font-bold text-base mb-1">{name}</h3>
        <div className="text-orange-500 font-bold text-sm mb-2">{rating} ⭐</div>
        <div className="text-xs text-gray-400">{trips.toLocaleString()} trajets</div>
      </div>

      <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded text-center block mb-3">
        {badge}
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="w-full bg-primary-600 text-white font-bold py-2 rounded hover:bg-primary-700 transition-colors text-sm"
        >
          Envoyer
        </button>
      )}
    </div>
  );
}

/* Article Card */
export function ArticleCard({
  title,
  category,
  icon,
  timestamp,
  reads,
  onLike,
  isLiked,
}: {
  title: string;
  category: string;
  icon: string;
  timestamp: string;
  reads: number;
  onLike?: () => void;
  isLiked?: boolean;
}) {
  return (
    <div className="bg-secondary-800 border border-gray-700 rounded-lg overflow-hidden hover:border-primary-600 transition-all p-4">
      <div className="grid grid-cols-4 gap-4">
        {/* Icon */}
        <div className="bg-gradient-to-br from-primary-600 to-orange-500 rounded-lg h-24 flex items-center justify-center text-4xl">
          {icon}
        </div>

        {/* Content */}
        <div className="col-span-3 flex flex-col justify-between">
          <div>
            <div className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mb-2">
              {category}
            </div>
            <h3 className="font-bold text-sm line-clamp-2 mb-2">{title}</h3>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{timestamp}</span>
            <div className="flex items-center gap-2">
              <span>{reads.toLocaleString()} lectures</span>
              <button
                onClick={onLike}
                className="hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
