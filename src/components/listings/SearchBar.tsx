'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search listings...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(query);
    }, 400); // 400ms debounce to match test expectation

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, onSearch]);

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      data-testid="search-input"
      className="px-4 py-2 border rounded-l w-full md:w-64 focus:outline-none focus:border-orange-500"
    />
  );
}
