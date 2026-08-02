'use client';

import Link from 'next/link';
import { Card } from '@/components/common';

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
  const formattedPrice = (price / 100000).toLocaleString('fr-SN');

  return (
    <Link href={`/listings/${id}`}>
      <Card hoverable className="h-full flex flex-col">
        {/* Image */}
        {thumbnail ? (
          <div className="w-full h-48 bg-gray-100 rounded mb-4 overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-50 rounded mb-4 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-3">{city}</p>

          {/* Price */}
          <p className="text-xl font-bold text-orange-500 mb-4">
            {formattedPrice}k XOF
          </p>

          {/* Seller */}
          {seller && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              {seller.avatar ? (
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center text-xs">
                  {seller.name[0]}
                </div>
              )}
              <span>{seller.name}</span>
            </div>
          )}

          {/* View count */}
          {viewCount > 0 && (
            <p className="text-xs text-gray-400">👁️ {viewCount} views</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
