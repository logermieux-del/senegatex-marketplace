'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ListingCard } from '@/components/listings/ListingCard';
import { SearchBar } from '@/components/listings/SearchBar';

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
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (loading !== true) {
      setLoading(true);
    }
    const timer = setTimeout(() => {
      fetchListings();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, selectedCategory, searchQuery]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '12');
      if (selectedCity) params.append('city', selectedCity);
      if (selectedCategory) params.append('category', selectedCategory);

      // Use search endpoint if there's a search query
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

  const handleStartSelling = () => {
    window.location.href = '/listings/create';
  };

  const cities = ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Tambacounda'];
  const categories = ['electronics', 'furniture', 'vehicles', 'clothing', 'services'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Yombal
          </Link>
          <div className="flex gap-4">
            <a href="/login" className="text-gray-700 hover:text-orange-500">
              Login
            </a>
            <Link href="/signup" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Buy & Sell Locally in Senegal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover amazing deals from neighbors near you
          </p>
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={handleStartSelling}
              className="bg-orange-500 text-white px-6 py-3 rounded text-lg hover:bg-orange-600"
            >
              Start Selling
            </button>
            <a
              href="#listings"
              className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded text-lg hover:bg-orange-50"
            >
              Browse Listings
            </a>
          </div>
          <div className="flex gap-2 justify-center">
            <SearchBar onSearch={setSearchQuery} />
            <button className="bg-orange-500 text-white px-4 py-2 rounded-r hover:bg-orange-600">
              Search
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="font-bold mb-4">Filter Listings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <select
                name="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div id="listings" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Latest Listings {pagination ? `(${pagination.total} total)` : ''}
          </h2>

          {loading ? (
            <div className="text-center py-12">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No listings found</p>
            </div>
          ) : (
            <>
              <div
                data-testid="listings-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {listings.map((listing) => (
                  <div key={listing.id} data-testid="listing-card">
                    <ListingCard
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      city={listing.city}
                      thumbnail={listing.thumbnail}
                      viewCount={listing.viewCount}
                      seller={listing.user}
                    />
                  </div>
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => {
                        // Pagination logic would go here
                      }}
                      className={`px-3 py-2 rounded ${
                        pagination.page === i + 1
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📱', title: 'Create Account', desc: 'Sign up in seconds' },
              { icon: '📸', title: 'List Items', desc: 'Add photos and details' },
              { icon: '💬', title: 'Connect', desc: 'Chat with buyers/sellers' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 Yombal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
