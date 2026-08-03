'use client';

import Link from 'next/link';
import { Eye, Heart } from 'lucide-react';
import { useState } from 'react';
import { IconBadge } from '@/components/icons/IconBadge';
import { PinIcon, PhotoIcon } from '@/components/icons/CategoryIcons';

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
  const [imageError, setImageError] = useState(false);
  const formattedPrice = (price / 100000).toLocaleString('fr-SN');

  return (
    <Link href={`/listings/${id}`}>
      <div className="group bg-white rounded-xl border border-accent-200 overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative bg-neutral-100 overflow-hidden h-56">
          {thumbnail && !imageError ? (
            <img
              src={thumbnail}
              alt={title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent-100 to-neutral-100 flex items-center justify-center">
              <IconBadge size={64}>
                <PhotoIcon className="w-8 h-8" />
              </IconBadge>
            </div>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className={`rounded-full transition-all ${
                isFavorite ? 'bg-orange-500 text-white p-3' : 'icon-badge text-accent-600 hover:text-orange-500 p-3'
              }`}
            >
              <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* New Badge */}
          <div className="absolute top-3 right-3 bg-success-500 text-white px-3 py-1 rounded-full text-xs font-bold font-sans">
            NOUVEAU
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-bold text-neutral-900 line-clamp-2 mb-3 text-sm group-hover:text-primary-600 transition-colors font-sans">
            {title}
          </h3>

          {/* Price - Highlight */}
          <p className="text-2xl font-bold text-success-500 mb-3 font-sans">
            {formattedPrice}k <span className="text-xs text-accent-500 font-normal">XOF</span>
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-accent-600 mb-4 font-sans">
            <PinIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{city}</span>
          </div>

          {/* Seller Info */}
          <div className="pt-3 border-t border-accent-200">
            {seller && (
              <div className="flex items-center gap-2 text-xs font-sans">
                {seller.avatar ? (
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                    {seller.name[0]}
                  </div>
                )}
                <span className="text-neutral-700 font-medium">{seller.name}</span>
              </div>
            )}

            {/* View Count */}
            {viewCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-accent-500 mt-2 font-sans">
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
