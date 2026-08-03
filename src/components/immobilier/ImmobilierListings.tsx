'use client';

import { useEffect, useState } from 'react';
import { ListingCard } from '@/components/listings/ListingCard';
import { IconBadge } from '@/components/icons/IconBadge';
import { EmptyBoxIcon, HouseIcon, LandPlotIcon } from '@/components/icons/CategoryIcons';

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  thumbnail?: string;
  viewCount: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ImmobilierListingsProps {
  transactionType: 'location' | 'achat' | 'vente';
  title: string;
  description: string;
  searchQuery: string;
  city: string;
}

const propertyTypes = [
  { id: '', label: 'Tous les biens', icon: null },
  { id: 'bati', label: 'Bâti', icon: HouseIcon },
  { id: 'non_bati', label: 'Non bâti', icon: LandPlotIcon },
] as const;

export function ImmobilierListings({ transactionType, title, description, searchQuery, city }: ImmobilierListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [propertyType, setPropertyType] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.append('category', 'immobilier');
      params.append('transactionType', transactionType);
      params.append('limit', '24');
      if (propertyType) params.append('propertyType', propertyType);
      if (city) params.append('city', city);
      if (searchQuery) params.append('q', searchQuery);

      fetch(`/api/listings?${params}`)
        .then((res) => res.json())
        .then((data) => {
          setListings(data.data || []);
          setTotal(data.pagination?.total ?? 0);
        })
        .catch(() => setListings([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [transactionType, propertyType, city, searchQuery]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-500 font-display">{title}</h1>
        <p className="text-accent-600 mt-2 font-sans">{description}</p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-accent-200 pb-4">
        {propertyTypes.map((type) => {
          const Icon = type.icon;
          const isActive = propertyType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setPropertyType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all font-sans ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-accent-600 border border-accent-200 hover:border-primary-300 hover:text-primary-500'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {type.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 rounded-full border-4 border-accent-200 border-t-primary-500 animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <IconBadge size={72} className="mb-4">
            <EmptyBoxIcon className="w-9 h-9" />
          </IconBadge>
          <p className="text-xl text-accent-600 font-medium font-sans">Aucun bien trouvé</p>
          <p className="text-accent-500 mt-2 font-sans">Essayez un autre filtre</p>
        </div>
      ) : (
        <>
          <p className="text-accent-600 mb-6 font-sans">
            {total} bien{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                city={listing.city}
                thumbnail={listing.thumbnail}
                viewCount={listing.viewCount}
                seller={listing.user}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
