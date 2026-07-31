'use client';

import { useEffect, useState } from 'react';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  category: string;
  thumbnail?: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface ListingsResponse {
  data: Listing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface UseListingsOptions {
  page?: number;
  limit?: number;
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function useListings(options: UseListingsOptions = {}) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.city) params.append('city', options.city);
        if (options.category) params.append('category', options.category);
        if (options.minPrice) params.append('minPrice', options.minPrice.toString());
        if (options.maxPrice) params.append('maxPrice', options.maxPrice.toString());

        const response = await fetch(`/api/listings?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch listings');

        const data: ListingsResponse = await response.json();
        setListings(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [options.page, options.limit, options.city, options.category, options.minPrice, options.maxPrice]);

  return { listings, pagination, isLoading, error };
}

export function useSearch(query: string) {
  const [results, setResults] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    async function search() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        setResults(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search error');
      } finally {
        setIsLoading(false);
      }
    }

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, isLoading, error };
}
