'use client';

import Link from 'next/link';
import { Eye, Heart } from 'lucide-react';
import { useState } from 'react';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  city: string;
  thumbnail?: string;
  viewCount?: number;
  seller?: {
    name: string;
    avatar?: string;
  };
}

export function ListingCard({
  id,
  title,
  price,
  city,
  thumbnail,
  viewCount = 0,
  seller,
}: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const formattedPrice = (price / 100000).toLocaleString('fr-SN');

  return (
    <Link href={`/listings/${id}`}>
      <div className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative bg-neutral-100 overflow-hidden h-56">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-100 flex items-center justify-center">
              <span className="text-5xl">📦</span>
            </div>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className={`p-3 rounded-full transition-all ${
                isFavorite
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-neutral-600 hover:text-orange-500'
              }`}
            >
              <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* New Badge */}
          <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            NOUVEAU
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-bold text-neutral-900 line-clamp-2 mb-3 text-sm group-hover:text-primary-600 transition-colors">
            {title}
          </h3>

          {/* Price - Highlight */}
          <p className="text-2xl font-bold text-primary-600 mb-3">
            {formattedPrice}k <span className="text-xs text-neutral-500 font-normal">XOF</span>
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 mb-4">
            <span>📍</span>
            <span>{city}</span>
          </div>

          {/* Seller Info */}
          <div className="pt-3 border-t border-neutral-200">
            {seller && (
              <div className="flex items-center gap-2 text-xs">
                {seller.avatar ? (
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary-200 flex items-center justify-center text-xs font-bold text-primary-700">
                    {seller.name[0]}
                  </div>
                )}
                <span className="text-neutral-700 font-medium">{seller.name}</span>
              </div>
            )}

            {/* View Count */}
            {viewCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-neutral-500 mt-2">
                <Eye className="w-3 h-3" />
                <span>{viewCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
