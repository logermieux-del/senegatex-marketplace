'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ImmobilierListings } from '@/components/immobilier/ImmobilierListings';

export default function ImmobilierLocationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCity={selectedCity}
        onSelectedCityChange={setSelectedCity}
      />
      <div className="min-h-screen bg-neutral-50">
        <ImmobilierListings
          transactionType="location"
          title="Location"
          description="Appartements, maisons et terrains à louer au Sénégal"
          searchQuery={searchQuery}
          city={selectedCity}
        />
      </div>
    </>
  );
}
