'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ListingCard } from '@/components/listings/ListingCard';

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  category: string;
  photos: string[];
  thumbnail?: string;
  viewCount: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '12');
      if (selectedCategory) params.append('category', selectedCategory);

      const endpoint = searchQuery ? '/api/search' : '/api/listings';
      if (searchQuery) params.append('q', searchQuery);

      const res = await fetch(`${endpoint}?${params}`);
      const data = await res.json();
      setListings(data.data || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-neutral-50">
        <div className="flex max-w-7xl mx-auto gap-6 px-4 py-8">
          {/* Sidebar */}
          <Sidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

          {/* Main Content */}
          <main className="flex-1">
            {/* Category Tabs */}
            <div className="mb-8">
              <div className="flex gap-2 overflow-x-auto pb-4 border-b border-accent-200">
                {['', 'electronics', 'furniture', 'vehicles', 'clothing', 'services'].map((cat) => (
                  <button
                    key={cat || 'all'}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all font-sans ${
                      selectedCategory === cat
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-accent-600 border border-accent-200 hover:border-primary-300 hover:text-primary-500'
                    }`}
                  >
                    {cat === '' ? 'Toutes' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-primary-500 font-display">
                {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Toutes les annonces'}
              </h1>
              {pagination && (
                <p className="text-accent-600 mt-2 font-sans">
                  {pagination.total} annonce{pagination.total > 1 ? 's' : ''} trouvée{pagination.total > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-accent-200 border-t-primary-500 animate-spin mx-auto mb-4"></div>
                  <p className="text-accent-600 font-sans">Chargement des annonces...</p>
                </div>
              </div>
            ) : listings.length === 0 ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <p className="text-3xl mb-4">📭</p>
                  <p className="text-xl text-accent-600 font-medium font-sans">Aucune annonce trouvée</p>
                  <p className="text-accent-500 mt-2 font-sans">Essayez d'autres filtres ou catégories</p>
                </div>
              </div>
            ) : (
              <>
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

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: pagination.pages }).map((_, i) => (
                      <button
                        key={i + 1}
                        className={`px-4 py-2 rounded-lg font-medium transition-all font-sans ${
                          pagination.page === i + 1
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-accent-600 border border-accent-200 hover:border-primary-300 hover:text-primary-500'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
