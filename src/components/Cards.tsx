import { Heart, Trophy } from 'lucide-react';

/* Match Card - Premium Sports */
export function MatchCard({
  sport,
  teams,
  score,
  time,
  status,
}: {
  sport: string;
  teams: string;
  score: string;
  time: string;
  status: 'EN DIRECT' | 'TERMINÉ' | 'À VENIR';
}) {
  const statusConfig = {
    'EN DIRECT': { bg: 'bg-blue-500/20', text: 'text-blue-300', badge: 'EN DIRECT' },
    'TERMINÉ': { bg: 'bg-primary-400/20', text: 'text-primary-300', badge: 'TERMINÉ' },
    'À VENIR': { bg: 'bg-secondary-700', text: 'text-primary-400', badge: 'À VENIR' },
  };

  const config = statusConfig[status];

  return (
    <div className="card-premium group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">{sport}</p>
          <h3 className="text-xl font-bold mt-2 text-white">{teams}</h3>
        </div>
        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${config.bg} ${config.text}`}>
          {config.badge}
        </span>
      </div>
      <div className="border-t border-secondary-600 pt-4">
        <div className="text-4xl font-bold text-blue-500 font-display mb-2">{score}</div>
        <p className="text-primary-400 text-sm">{time}</p>
      </div>
    </div>
  );
}

/* Athlete Card - Premium Sports */
export function AthleteCard({
  name,
  sport,
  rating,
  matches,
}: {
  name: string;
  sport: string;
  rating: number;
  matches: number;
}) {
  return (
    <div className="card-premium">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mx-auto mb-4 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-bold text-lg mb-1 text-white">{name}</h3>
        <p className="text-gray-400 text-sm mb-4">{sport}</p>
        <div className="flex justify-around pt-4 border-t border-secondary-600">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">{rating}</p>
            <p className="text-xs text-gray-400">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{matches}</p>
            <p className="text-xs text-gray-400">Matchs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Article Card - Premium News */
export function ArticleCard({
  title,
  category,
  timestamp,
  reads,
  onLike,
  isLiked,
}: {
  title: string;
  category: string;
  timestamp: string;
  reads: number;
  onLike?: () => void;
  isLiked?: boolean;
}) {
  return (
    <div className="card-premium hover:bg-secondary-700/50">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">{category}</p>
          <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>{timestamp}</span>
            <span>•</span>
            <span>{reads.toLocaleString()} lectures</span>
          </div>
        </div>
        <button
          onClick={onLike}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-700 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked ? 'fill-accent-500 text-accent-500' : 'text-primary-400'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

/* Transporter Card - Legacy Support */
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
    <div className="w-64 card-premium">
      <div className="text-center mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-primary-400 rounded-full mx-auto flex items-center justify-center text-3xl mb-3">
          👤
        </div>
        <h3 className="font-bold text-base mb-1">{name}</h3>
        <div className="text-blue-400 font-bold text-sm mb-2">{rating} ⭐</div>
        <div className="text-xs text-primary-400">{trips.toLocaleString()} trajets</div>
      </div>

      <div className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded text-center block mb-3">
        {badge}
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Envoyer
        </button>
      )}
    </div>
  );
}

/* Result Card - Legacy Support */
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
    'en-cours': { bg: 'bg-blue-600', text: '● EN COURS' },
    retard: { bg: 'bg-accent-600', text: '⚠️ RETARD' },
  };

  return (
    <div className="card-premium">
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <div className="text-2xl mb-2">📦</div>
          <div className="font-bold text-sm">{from}</div>
        </div>

        <div className="text-center">
          <div className="text-2xl mb-2">→</div>
          <div className={`${statusConfig[status].bg} text-white text-xs font-bold px-3 py-1 rounded inline-block`}>
            {statusConfig[status].text}
          </div>
          <div className="text-xs text-primary-400 mt-2">{timestamp}</div>
        </div>

        <div className="text-center">
          <div className="text-2xl mb-2">🏁</div>
          <div className="font-bold text-sm">{to}</div>
        </div>
      </div>
    </div>
  );
}
